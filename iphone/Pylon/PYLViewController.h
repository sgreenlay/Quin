//
//  PYLViewController.h
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <FacebookSDK/FacebookSDK.h>

@interface PYLViewController : UIViewController<UIWebViewDelegate> {
    BOOL isRecording;
    AVAudioRecorder *audioRecorder;
    NSString *speechFilePath;
    FBLoginView *loginview;
}

@property (weak, nonatomic) IBOutlet UIButton *button;
@property (weak, nonatomic) IBOutlet UIWebView *webView;
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;
@property (weak, nonatomic) IBOutlet UIImageView *glowView;
@property (weak, nonatomic) IBOutlet UIImageView *glowProc;

- (IBAction)searchButtonPress:(id)sender;

@end
