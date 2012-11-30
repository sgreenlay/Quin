//
//  PYLViewController.h
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@interface PYLViewController : UIViewController<UIWebViewDelegate> {
    BOOL isRecording;
    AVAudioRecorder *audioRecorder;
    NSString *speechFilePath;
}

@property (weak, nonatomic) IBOutlet UIButton *button;
@property (weak, nonatomic) IBOutlet UIWebView *webView;

- (IBAction)searchButtonPress:(id)sender;

@end
