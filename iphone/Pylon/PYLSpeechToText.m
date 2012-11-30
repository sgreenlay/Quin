//
//  PYLSpeechToText.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLSpeechToText.h"

#import <FLAC/all.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

NSMutableData *flacData = nil;

void print_osstatus(OSStatus status) {
    switch (status) {
        case kAudioSessionNoError:
            NSLog(@"ERROR: kAudioSessionNoError");
            break;
        case kAudioSessionNotInitialized:
            NSLog(@"ERROR: kAudioSessionNotInitialized");
            break;
        case kAudioSessionAlreadyInitialized:
            NSLog(@"ERROR: kAudioSessionAlreadyInitialized");
            break;
        case kAudioSessionInitializationError:
            NSLog(@"ERROR: kAudioSessionInitializationError");
            break;
        case kAudioSessionUnsupportedPropertyError:
            NSLog(@"ERROR: kAudioSessionUnsupportedPropertyError");
            break;
        case kAudioSessionBadPropertySizeError:
            NSLog(@"ERROR: kAudioSessionBadPropertySizeError");
            break;
        case kAudioSessionNotActiveError:
            NSLog(@"ERROR: kAudioSessionNotActiveError");
            break;
        case kAudioServicesNoHardwareError:
            NSLog(@"ERROR: kAudioServicesNoHardwareError");
            break;
        case kAudioSessionNoCategorySet:
            NSLog(@"ERROR: kAudioSessionNoCategorySet");
            break;
        case kAudioSessionIncompatibleCategory:
            NSLog(@"ERROR: kAudioSessionIncompatibleCategory");
            break;
        case kAudioSessionUnspecifiedError:
            NSLog(@"ERROR: kAudioSessionUnspecifiedError");
            break;
        default:
            NSLog(@"ERROR: who the fuck knows: %lx", status);
            break;
    }
}

FLAC__StreamEncoderWriteStatus write_callback(const FLAC__StreamEncoder *encoder, const FLAC__byte buffer[], size_t bytes, unsigned samples, unsigned current_frame, void *client_data) {
    if (flacData != nil)
    {
        [flacData appendBytes:buffer length:bytes];
        return FLAC__STREAM_ENCODER_WRITE_STATUS_OK;
    }
    return FLAC__STREAM_ENCODER_WRITE_STATUS_FATAL_ERROR;
}

@implementation PYLSpeechToText

+ (void)encodeToFLACFromURL:(NSURL *)url error:(NSError **)error {
    FLAC__bool ok = true;
    FLAC__StreamEncoder *encoder = 0;
    FLAC__StreamEncoderInitStatus init_status;
    
    OSStatus err;
    ExtAudioFileRef audioFileRef;
    AudioStreamBasicDescription audioFileDesc;
    UInt32 propertySize = 0;
    SInt32 numberOfFrames = 0;
    
    if (flacData == nil) {
        // TODO: error
        return;
    }
    
    err = ExtAudioFileOpenURL((__bridge CFURLRef)(url), &audioFileRef);
    if (err)
    {
        // TODO: error
        print_osstatus(err);
        return;
    }
    
    propertySize = sizeof(AudioStreamBasicDescription);
    err = ExtAudioFileGetProperty(audioFileRef, kExtAudioFileProperty_FileDataFormat, &propertySize, &audioFileDesc);
    if (err)
    {
        // TODO: error
        print_osstatus(err);
        return;
    }
    
    propertySize = sizeof(AudioStreamBasicDescription);
    err = ExtAudioFileGetProperty(audioFileRef, kExtAudioFileProperty_FileLengthFrames, &propertySize, &numberOfFrames);
    if (err)
    {
        // TODO: error
        print_osstatus(err);
        return;
    }
    
    if ((encoder = FLAC__stream_encoder_new()) == NULL) {
		// TODO: error
        return;
	}
    
	ok &= FLAC__stream_encoder_set_verify(encoder, true);
	ok &= FLAC__stream_encoder_set_compression_level(encoder, 5);
	ok &= FLAC__stream_encoder_set_channels(encoder, audioFileDesc.mChannelsPerFrame);
	ok &= FLAC__stream_encoder_set_bits_per_sample(encoder, audioFileDesc.mBitsPerChannel);
	ok &= FLAC__stream_encoder_set_sample_rate(encoder, audioFileDesc.mSampleRate);
	ok &= FLAC__stream_encoder_set_total_samples_estimate(encoder, numberOfFrames);
    
    if (!ok) {
        // TODO: error
        return;
    }
    
    init_status = FLAC__stream_encoder_init_stream(encoder, write_callback, NULL, NULL, NULL, NULL);
    if (init_status != FLAC__STREAM_ENCODER_INIT_STATUS_OK) {
        // TODO: error
        return;
    }
    
    for (int i = 0; ; i++) {
        UInt16 buffer[2048];
        
        AudioBufferList fillBufList;
        fillBufList.mNumberBuffers = 1;
        fillBufList.mBuffers[0].mNumberChannels = audioFileDesc.mChannelsPerFrame;
        fillBufList.mBuffers[0].mDataByteSize = (2048 * sizeof(UInt16));
        fillBufList.mBuffers[0].mData = buffer;
        
        UInt32 num_frames = fillBufList.mBuffers[0].mDataByteSize / audioFileDesc.mBytesPerFrame;
        
        err = ExtAudioFileRead(audioFileRef, &num_frames, &fillBufList);
        if (err)
        {
            // TODO: error
            print_osstatus(err);
            return;
        }
        
        if (!num_frames) {
            break;
        }
        
        FLAC__int32 pcm[1024];
        for (int i = 0; i < 1024; i++) {
            pcm[i] = (FLAC__int32)buffer[2*i];
        }
        
        ok = FLAC__stream_encoder_process_interleaved(encoder, (void *)pcm, num_frames);
        if (!ok) {
            // TODO: error
            
            switch(FLAC__stream_encoder_get_state(encoder)) {
                case FLAC__STREAM_ENCODER_UNINITIALIZED:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_UNINITIALIZED");
                    break;
                case FLAC__STREAM_ENCODER_OGG_ERROR:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_OGG_ERROR");
                    break;
                case FLAC__STREAM_ENCODER_VERIFY_DECODER_ERROR:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_VERIFY_DECODER_ERROR");
                    break;
                case FLAC__STREAM_ENCODER_VERIFY_MISMATCH_IN_AUDIO_DATA:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_VERIFY_MISMATCH_IN_AUDIO_DATA");
                    break;
                case FLAC__STREAM_ENCODER_CLIENT_ERROR:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_CLIENT_ERROR");
                    break;
                case FLAC__STREAM_ENCODER_IO_ERROR:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_IO_ERROR");
                    break;
                case FLAC__STREAM_ENCODER_FRAMING_ERROR:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_FRAMING_ERROR");
                    break;
                case FLAC__STREAM_ENCODER_MEMORY_ALLOCATION_ERROR:
                    NSLog(@"ERROR: FLAC__STREAM_ENCODER_MEMORY_ALLOCATION_ERROR");
                    break;
                default:
                    NSLog(@"ERROR: who the fuck knows");
                    break;
            }
            
            return;
        }
    }
    
    ok &= FLAC__stream_encoder_finish(encoder);
    if (!ok) {
        // TODO: error
        return;
    }
    
    FLAC__stream_encoder_delete(encoder);
}

+ (void)convertSpeechToText:(NSURL *)url andProcessTextWithBlock:(void (^)(NSString *))block error:(NSError **)error {
    flacData = [NSMutableData new];
    
    [PYLSpeechToText encodeToFLACFromURL:url error:error];
    
    NSArray *directoryPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [directoryPaths objectAtIndex:0];
    NSString *path = [documentsDirectory stringByAppendingPathComponent:@"test.flac"];
    
    [flacData writeToFile:path atomically:TRUE];
    
    block(@"Test");
}

@end
