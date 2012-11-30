//
//  PYLAppDelegate.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLAppDelegate.h"

@implementation PYLAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [FBSession openActiveSessionWithAllowLoginUI:true];
    
    NSArray *permissions = [NSArray arrayWithObjects:
                            @"friends_about_me",
                            @"friends_actions.music",
                            @"friends_actions.news",
                            @"friends_actions.video",
                            @"friends_activities",
                            @"friends_birthday",
                            @"friends_education_history",
                            @"friends_events",
                            @"friends_games_activity",
                            @"friends_groups",
                            @"friends_hometown",
                            @"friends_interests",
                            @"friends_likes",
                            @"friends_location",
                            @"friends_notes",
                            @"friends_photos",
                            @"friends_questions",
                            @"friends_relationship_details",
                            @"friends_relationships",
                            @"friends_religion_politics",
                            @"friends_status",
                            @"friends_subscriptions",
                            @"friends_videos",
                            @"friends_website",
                            @"friends_work_history",
                            nil];
    
    [FBSession openActiveSessionWithReadPermissions:permissions allowLoginUI:true completionHandler:^(FBSession *session, FBSessionState status, NSError *error) {
        if (error) {
            NSLog(@"Failure");
        }
    }];
    
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [FBSession.activeSession handleOpenURL:url];
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    //
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    //
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    //
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [FBSession.activeSession handleDidBecomeActive];
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    [FBSession.activeSession close];
}

@end
