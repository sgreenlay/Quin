//
//  PYLSpeechToText.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLSpeechToText.h"
#import "PYLHelper.h"
#import "WAVtoFLAC.h"

#import <FLAC/all.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

NSMutableData *flacData = nil;

@implementation PYLSpeechToText

+ (void)convertSpeechToText:(NSString *)wavPath andProcessTextWithBlock:(void (^)(NSString *, NSError *))block {
    NSArray *directoryPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [directoryPaths objectAtIndex:0];
    NSString *flacPath = [documentsDirectory stringByAppendingPathComponent:@"speech.flac"];
    
    if (convertWavToFlac([wavPath cStringUsingEncoding:NSUTF8StringEncoding], [flacPath cStringUsingEncoding:NSUTF8StringEncoding]))
    {
        block(@"", [NSError errorWithDomain:@"Pylon" code:1 userInfo:nil]);
        return;
    }
    
    NSMutableURLRequest *request = [NSMutableURLRequest new];
    [request setURL:[NSURL URLWithString:@"https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&lang=en-US&maxresults=10&pfilter=0"]];
    [request setHTTPMethod:@"POST"];
    
    NSString *boundary = @"---------------------------14737809831466499882746641449";
    NSString *contentType = [NSString stringWithFormat:@"audio/x-flac; rate=44100 boundary=%@", boundary];
    
    NSData *flacData = [NSData dataWithContentsOfFile:flacPath];
    
    [request setValue:contentType forHTTPHeaderField: @"content-Type"];
    [request setHTTPBody:flacData];
    
    [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {
        
        [[NSFileManager defaultManager] removeItemAtPath:flacPath error:nil];
        
        NSDictionary *returnValues = (NSDictionary *)[NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        
        NSArray *options = [returnValues valueForKey:@"hypotheses"];
        if (options == nil || options.count < 1) {
            block(@"", [NSError errorWithDomain:@"Pylon" code:1 userInfo:nil]);
            return;
        }
        
        NSDictionary *bestResult = [options objectAtIndex:0];
        NSString *result = [bestResult valueForKey:@"utterance"];
        if (result == nil) {
            block(@"", [NSError errorWithDomain:@"Pylon" code:1 userInfo:nil]);
            return;
        }
        
        block(result, nil);
    }];
}

@end
