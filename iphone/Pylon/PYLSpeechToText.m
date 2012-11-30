//
//  PYLSpeechToText.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLSpeechToText.h"
#import "WAVtoFLAC.h"

#import <FLAC/all.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

NSMutableData *flacData = nil;

@implementation PYLSpeechToText

+ (void)convertSpeechToText:(NSString *)wavPath andProcessTextWithBlock:(void (^)(NSString *))block error:(NSError **)error {
    NSArray *directoryPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [directoryPaths objectAtIndex:0];
    NSString *flacPath = [documentsDirectory stringByAppendingPathComponent:@"test.flac"];
    
    convertWavToFlac([wavPath cStringUsingEncoding:NSUTF8StringEncoding], [flacPath cStringUsingEncoding:NSUTF8StringEncoding]);
    
    
    
    block(@"Test");
}

@end
