#!/bin/bash
#
# Open new iTerm window from the command line
#
# Usage:
#     iterm                   Opens the current directory in a new iTerm window
#     iterm [PATH]            Open PATH in a new iTerm window
#     iterm [CMD]             Open a new iTerm window and execute CMD
#     iterm [PATH] [CMD] ...  You can prob'ly guess
#
# Example:
#     iterm ~/Code/HelloWorld ./setup.sh
#
# References:
#     iTerm AppleScript Examples:
#     https://gitlab.com/gnachman/iterm2/wikis/Applescript
# 
# Credit:
#     Inspired by tab.bash by @bobthecow
#     link: https://gist.github.com/bobthecow/757788
#

# OSX only
[ `uname -s` != "Darwin" ] && return
PWD="${PWD}"

function iterm () {
    osascript &>/dev/null <<EOF
tell application "iTerm"
	--Create initial window
	--create window with default profile
	
	--Create a second tab in the initial window
	tell current window
		create tab with default profile
	end tell
	
	--Send a command to the first tab
	tell current session of tab 1 of current window
		write text "cd $PWD"
	end tell
	
	--Send a couple of commands to the second tab
	tell current session of tab 2 of current window
		write text "cd $PWD"
	end tell

	--Select the first tab
	tell tab 1 of current window
		select
	end tell
end tell
EOF
}
iterm