//
//  PYLViewController.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLViewController.h"
#import "PYLHelper.h"
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

- (void)webViewDidFinishLoad:(UIWebView *)webView{
    NSLog(@"Done loading.");
}
- (BOOL)webView:(UIWebView*)webView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType {
    return YES;
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"Error.");
}

- (void)startRecording {
    [audioRecorder record];
}

- (void)stopRecording {
    [audioRecorder stop];
    [PYLSpeechToText convertSpeechToText:speechFilePath andProcessTextWithBlock:^(NSString * text, NSError *error) {
        if (error == nil) {
            NSString * queryUrl = [NSString stringWithFormat:@"http://192.168.2.1:3000/?query=%@", text];
            NSString *acceptableUrl = [queryUrl stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
            NSURL * url = [NSURL URLWithString:acceptableUrl];
            [_webView loadRequest:[NSURLRequest requestWithURL:url]];
        }
        [_button.imageView stopAnimating];
        _button.imageView.animationImages = nil;
        _button.imageView.image = [UIImage imageNamed:@"Button.png"];
    }];
}

- (IBAction)searchButtonPress:(id)sender {
    if (!isRecording) {
        [self startRecording];
        
        _button.imageView.animationImages = [NSArray arrayWithObjects:
                                             [UIImage imageNamed:@"Button-anim1.png"],
                                             [UIImage imageNamed:@"Button-anim2.png"],
                                             [UIImage imageNamed:@"Button-anim3.png"],
                                             [UIImage imageNamed:@"Button-anim4.png"],
                                             [UIImage imageNamed:@"Button-anim5.png"],
                                             nil];
        _button.imageView.animationDuration = 0.7;
        [_button.imageView startAnimating];
        
        isRecording = TRUE;
    }
    else {
        isRecording = FALSE;
        [self stopRecording];
    }
}

@end
