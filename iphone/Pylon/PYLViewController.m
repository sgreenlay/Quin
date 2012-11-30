//
//  PYLViewController.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLViewController.h"
#import "PYLSpeechToText.h"

@interface PYLViewController ()

@end

@implementation PYLViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	
    isRecording = FALSE;
    
    NSArray *directoryPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [directoryPaths objectAtIndex:0];
    speechFilePath = [documentsDirectory stringByAppendingPathComponent:@"speech.wav"];
    
    NSDictionary *recordSettings = [NSDictionary dictionaryWithObjectsAndKeys:
                                    [NSNumber numberWithInt:kAudioFormatLinearPCM], AVFormatIDKey,
                                    [NSNumber numberWithFloat:44100.0], AVSampleRateKey,
                                    [NSNumber numberWithInt: 2], AVNumberOfChannelsKey,
                                    [NSNumber numberWithInt:16], AVLinearPCMBitDepthKey,
                                    [NSNumber numberWithBool:NO], AVLinearPCMIsBigEndianKey,
                                    [NSNumber numberWithBool:NO], AVLinearPCMIsFloatKey,
                                    nil];
    
    audioRecorder = [[AVAudioRecorder alloc] initWithURL:[NSURL URLWithString:speechFilePath] settings:recordSettings error:nil];
    
    [audioRecorder prepareToRecord];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)searchButtonPress:(id)sender {
    if (!isRecording) {
        [audioRecorder record];
        isRecording = TRUE;
    }
    else {
        [audioRecorder stop];
        [PYLSpeechToText convertSpeechToText:speechFilePath andProcessTextWithBlock:^(NSString * text) {
            NSLog(@"%@", text);
        } error:nil];
    }
}

@end
