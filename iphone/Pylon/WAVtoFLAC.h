//
//  PLYWAVtoFLAC.h
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#ifndef Pylon_PLYWAVtoFLAC_h
#define Pylon_PLYWAVtoFLAC_h

// Modified from https://github.com/jhurt/wav_to_flac

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "FLAC/metadata.h"
#include "FLAC/stream_encoder.h"

#define READSIZE 1024

static FLAC__byte buffer[READSIZE * 2 * 2]; // samples * bytes per sample * channels
static FLAC__int32 pcm[READSIZE * 2]; // samples * channels

int convertWavToFlac(const char *wave_file_in, const char *flac_file_out) {
	FILE *fin;
    
	if ((fin = fopen(wave_file_in, "rb")) == NULL) {
		fprintf(stderr, "ERROR: opening %s for output\n", wave_file_in);
		return 1;
	}
    
	if (fread(buffer, 1, 44, fin) != 44 || memcmp(buffer, "RIFF", 4) || memcmp(buffer+36, "FLLR", 4)) {
        fprintf(stderr, "ERROR: invalid/unsupported WAVE file\n");
        fclose(fin);
        return 1;
	}
    unsigned num_channels = ((unsigned)buffer[23] << 8) | buffer[22];
	unsigned sample_rate = ((((((unsigned)buffer[27] << 8) | buffer[26]) << 8) | buffer[25]) << 8) | buffer[24];
	unsigned bps = ((unsigned)buffer[35] << 8) | buffer[34];
    
    unsigned filler_byte_count = ((unsigned)buffer[41] << 8) | buffer[40];
    
    if (fread(buffer, 1, filler_byte_count, fin) != filler_byte_count) {
        fprintf(stderr, "ERROR: invalid number of filler bytes\n");
        return 1;
    }
    
    unsigned data_subchunk_size = 0;
    if (fread(buffer, 1, 8, fin) != 8 || memcmp(buffer, "data", 4))  {
        fprintf(stderr, "ERROR: bad data start section\n");
        return 1;
    }
    else {
        data_subchunk_size = ((((((unsigned)buffer[7] << 8) | buffer[6]) << 8) | buffer[5]) << 8) | buffer[4]; // num samples * channels * bits per sample / 8
    }
    
	FLAC__StreamEncoder *encoder = 0;
	if ((encoder = FLAC__stream_encoder_new()) == NULL) {
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
	ok &= FLAC__stream_encoder_set_total_samples_estimate(encoder, 0);
    
	if (ok) {
		FLAC__StreamEncoderInitStatus init_status = FLAC__stream_encoder_init_file(encoder, flac_file_out, NULL, NULL);
		if (init_status != FLAC__STREAM_ENCODER_INIT_STATUS_OK) {
			fprintf(stderr, "ERROR: initializing encoder: %s\n", FLAC__StreamEncoderInitStatusString[init_status]);
			ok = false;
		}
	}
    
    if (ok) {
        size_t bytes_read = 0;
        size_t need = (size_t)READSIZE;
		while ((bytes_read = fread(buffer, num_channels * (bps/8), need, fin)) != 0) {
            size_t i;
            for (i = 0; i < bytes_read*num_channels; i++) {
                pcm[i] = (FLAC__int32)(((FLAC__int16)(FLAC__int8)buffer[2*i+1] << 8) | (FLAC__int16)buffer[2*i]);
            }
            ok = FLAC__stream_encoder_process_interleaved(encoder, pcm, bytes_read);
		}
	}
    
	ok &= FLAC__stream_encoder_finish(encoder);
	fprintf(stderr, "encoding: %s\n", ok? "Conversion finished" : "Conversion failed");
    
	FLAC__stream_encoder_delete(encoder);
	fclose(fin);
    
    if (ok) {
        return 0;
    }
    return 1;
}

#endif
