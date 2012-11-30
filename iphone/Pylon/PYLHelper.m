//
//  PYLHelper.m
//  Pylon
//
//  Created by Scott Greenlay on 2012-11-29.
//  Copyright (c) 2012 Waterloo Hackathon Team. All rights reserved.
//

#import "PYLHelper.h"

@implementation PYLHelper

+ (NSString *)getUniqueFilenameInFolder:(NSString *)folder forFileExtension:(NSString *)fileExtension {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *existingFiles = [fileManager contentsOfDirectoryAtPath:folder error:nil];
    NSString *uniqueFilename;
    
    // Retrieved from: http://stackoverflow.com/a/5900932/169021
    do {
        CFUUIDRef newUniqueId = CFUUIDCreate(kCFAllocatorDefault);
        CFStringRef newUniqueIdString = CFUUIDCreateString(kCFAllocatorDefault, newUniqueId);
        
        uniqueFilename = [[[folder stringByAppendingPathComponent:(__bridge NSString *)newUniqueIdString] stringByAppendingPathExtension:fileExtension] stringByReplacingOccurrencesOfString:@"-" withString:@""];
        
        CFRelease(newUniqueId);
        CFRelease(newUniqueIdString);
    } while ([existingFiles containsObject:uniqueFilename]);
    
    return uniqueFilename;
}

@end
