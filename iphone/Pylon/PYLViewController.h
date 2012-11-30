//
//  PYLViewController.h
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@interface PYLViewController : UIViewController {
    BOOL isRecording;
    AVAudioRecorder *audioRecorder;
    NSString *speechFilePath;
}

- (IBAction)searchButtonPress:(id)sender;

@end
