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
#import <QuartzCore/QuartzCore.h>

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
    [self.glowView setHidden:YES];
    [self.glowProc setHidden:YES];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)webViewDidFinishLoad:(UIWebView *)webView{
    [self fadeOut:self.glowProc];

    NSLog(@"Done loading.");
}
- (BOOL)webView:(UIWebView*)webView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType {
    return YES;
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"Error. %@", error);
}

- (void)startRecording {
    [audioRecorder record];
}

- (void)stopRecording {
    
    [self fadeOut:self.glowView];
    [self fadeIn:self.glowProc];
    
    [audioRecorder stop];
    [PYLSpeechToText convertSpeechToText:speechFilePath andProcessTextWithBlock:^(NSString * text, NSError *error) {
        if (error == nil) {
            NSString * queryUrl = [NSString stringWithFormat:@"http://searchapp.herokuapp.com/?query=%@", text];
            NSString *acceptableUrl = [queryUrl stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
            NSURL * url = [NSURL URLWithString:acceptableUrl];
            [_webView loadRequest:[NSURLRequest requestWithURL:url]];
        } else {
            [self fadeOut:self.glowProc];
        }
    }];
}

- (IBAction)searchButtonPress:(id)sender {
    if (!isRecording) {
        [self startRecording];

        CABasicAnimation* rotationAnimation;
        rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
        rotationAnimation.toValue = [NSNumber numberWithFloat: M_PI * -2.0];
        rotationAnimation.duration = 1.5;
        rotationAnimation.cumulative = YES;
        rotationAnimation.repeatCount = 1e100f;
        [self.glowView.layer addAnimation:rotationAnimation forKey:@"rotationAnimation"];
        [self.glowProc.layer addAnimation:rotationAnimation forKey:@"rotation"];
        
        [self fadeIn:self.glowView];
        
        isRecording = TRUE;
    }
    else {
        isRecording = FALSE;
        [self stopRecording];
    }
}

- (void)fadeIn:(UIView*)view {
    CABasicAnimation* fadeAnim;
    fadeAnim = [CABasicAnimation animationWithKeyPath:@"opacity"];
    fadeAnim.toValue = [NSNumber numberWithFloat:1.0f];
    fadeAnim.duration = 0.3;
    fadeAnim.removedOnCompletion = NO;
    fadeAnim.fillMode = kCAFillModeForwards;
    view.layer.opacity = 0.0f;
    [view.layer addAnimation:fadeAnim forKey:@"fadeIn"];
    view.hidden = NO;
}

- (void)fadeOut:(UIView*)view {
    CABasicAnimation* fadeAnim;
    fadeAnim = [CABasicAnimation animationWithKeyPath:@"opacity"];
    fadeAnim.toValue = [NSNumber numberWithFloat:0];
    fadeAnim.duration = 0.3;
    fadeAnim.removedOnCompletion = NO;
    fadeAnim.fillMode = kCAFillModeForwards;
    view.layer.opacity = 1.0f;
    [view.layer addAnimation:fadeAnim forKey:@"fadeOut"];
}

@end
