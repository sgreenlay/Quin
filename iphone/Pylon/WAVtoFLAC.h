//
//  PLYWAVtoFLAC.h
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#ifndef Pylon_PLYWAVtoFLAC_h
#define Pylon_PLYWAVtoFLAC_h

// Retrieved from https://github.com/jhurt/wav_to_flac

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "FLAC/metadata.h"
#include "FLAC/stream_encoder.h"

static void progress_callback(const FLAC__StreamEncoder *encoder, FLAC__uint64 bytes_written, FLAC__uint64 samples_written, unsigned frames_written, unsigned total_frames_estimate, void *client_data);

#define READSIZE 1024

static FLAC__byte buffer[READSIZE/*samples*/ * 2/*bytes_per_sample*/ * 2/*channels*/];
static FLAC__int32 pcm[READSIZE/*samples*/ * 2/*channels*/];

int convertWavToFlac(const char *wave_file_in, const char *flac_file_out) {
	FILE *fin;
	if((fin = fopen(wave_file_in, "rb")) == NULL) {
		fprintf(stderr, "ERROR: opening %s for output\n", wave_file_in);
		return 1;
	}
    
	// read wav header and validate it, note this will most likely fail for WAVE files not created by Apple
	if(fread(buffer, 1, 44, fin) != 44 ||
       memcmp(buffer, "RIFF", 4) ||
       memcmp(buffer+36, "FLLR", 4)) {
		fprintf(stderr, "ERROR: invalid/unsupported WAVE file\n");
		fclose(fin);
		return 1;
	}
    unsigned num_channels = ((unsigned)buffer[23] << 8) | buffer[22];;
	unsigned sample_rate = ((((((unsigned)buffer[27] << 8) | buffer[26]) << 8) | buffer[25]) << 8) | buffer[24];
    //unsigned byte_rate = ((((((unsigned)buffer[31] << 8) | buffer[30]) << 8) | buffer[29]) << 8) | buffer[28];
    //unsigned block_align = ((unsigned)buffer[33] << 8) | buffer[32];
	unsigned bps = ((unsigned)buffer[35] << 8) | buffer[34];
    
    //Apple puts the number of filler bytes in the 2 bytes following FLLR in the filler chunk
    //get the int value of the hex
    unsigned filler_byte_count = ((unsigned)buffer[41] << 8) | buffer[40];
    //swallow the filler bytes, exiting if there were not enough
    if(fread(buffer, 1, filler_byte_count, fin) != filler_byte_count) {
        fprintf(stderr, "ERROR: invalid number of filler bytes\n");
        return 1;
    }
    //swallow the beginning of the data chunk, i.e. the word 'data'
    unsigned data_subchunk_size = 0;
    if(fread(buffer, 1, 8, fin) != 8 || memcmp(buffer, "data", 4))  {
        fprintf(stderr, "ERROR: bad data start section\n");
        return 1;
    }
    else {
        //Subchunk2Size == NumSamples * NumChannels * BitsPerSample/8
        data_subchunk_size = ((((((unsigned)buffer[7] << 8) | buffer[6]) << 8) | buffer[5]) << 8) | buffer[4];
    }
    
	FLAC__StreamEncoder *encoder = 0;
	if((encoder = FLAC__stream_encoder_new()) == NULL) {
		fprintf(stderr, "ERROR: allocating encoder\n");
		fclose(fin);
		return 1;
	}
    
    FLAC__bool ok = true;
	ok &= FLAC__stream_encoder_set_verify(encoder, true);
	ok &= FLAC__stream_encoder_set_compression_level(encoder, 5);
	ok &= FLAC__stream_encoder_set_channels(encoder, num_channels);
	ok &= FLAC__stream_encoder_set_bits_per_sample(encoder, bps);
	ok &= FLAC__stream_encoder_set_sample_rate(encoder, sample_rate);
    //unknown total samples
	ok &= FLAC__stream_encoder_set_total_samples_estimate(encoder, 0);
    
    //create the flac encoder
	if(ok) {
		FLAC__StreamEncoderInitStatus init_status = FLAC__stream_encoder_init_file(encoder, flac_file_out, progress_callback, /*client_data=*/NULL);
		if(init_status != FLAC__STREAM_ENCODER_INIT_STATUS_OK) {
			fprintf(stderr, "ERROR: initializing encoder: %s\n", FLAC__StreamEncoderInitStatusString[init_status]);
			ok = false;
		}
	}
    
    //read the wav file data chunk until we reach the end of the file.
    if(ok) {
        size_t bytes_read = 0;
        size_t need = (size_t)READSIZE;
		while((bytes_read = fread(buffer, num_channels * (bps/8), need, fin)) != 0) {
            /* convert the packed little-endian 16-bit PCM samples from WAVE into an interleaved FLAC__int32 buffer for libFLAC */
            size_t i;
            for(i = 0; i < bytes_read*num_channels; i++) {
                /* inefficient but simple and works on big- or little-endian machines */
                pcm[i] = (FLAC__int32)(((FLAC__int16)(FLAC__int8)buffer[2*i+1] << 8) | (FLAC__int16)buffer[2*i]);
            }
            /* feed samples to encoder */
            ok = FLAC__stream_encoder_process_interleaved(encoder, pcm, bytes_read);
		}
	}
    
	ok &= FLAC__stream_encoder_finish(encoder);
	fprintf(stderr, "encoding: %s\n", ok? "Conversion finished" : "Conversion failed");
    
    //cleanup
	FLAC__stream_encoder_delete(encoder);
	fclose(fin);
    
    if(ok) {
        return 0;
    }
    return 1;
}

void progress_callback(const FLAC__StreamEncoder *encoder, FLAC__uint64 bytes_written, FLAC__uint64 samples_written, unsigned frames_written, unsigned total_frames_estimate, void *client_data) {
	//fprintf(stderr, "wrote %llu bytes\n", bytes_written);
}

#endif
