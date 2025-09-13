# Hack Page - Secure Code Transfer Protocol

## Overview
The Hack Page is a specialized anonymous chat designed for securely transferring code snippets between devices. It provides perfect formatting preservation, syntax highlighting, and instant synchronization.

## Access
- **Keyboard Shortcut**: `Ctrl + Shift + H` from anywhere in the application
- **URL**: Navigate to `/hack`

## Features

### 🔒 **Anonymous & Secure**
- No user authentication required
- Anonymous code sharing between devices
- Automatic cleanup of old messages (24 hours)

### 💻 **Code-Optimized Interface**
- **Perfect Formatting Preservation**: Maintains exact indentation, spacing, and line breaks
- **Syntax Highlighting**: Support for 19 programming languages
- **Tab Support**: Press Tab for proper indentation (4 spaces)
- **Line Preservation**: No line changes or formatting modifications

### ⚡ **Quick Actions**
- **Copy to Clipboard**: One-click copy button for each message
- **Download as File**: Save code snippets as files with proper extensions
- **File Upload**: Drag & drop or upload code files (up to 1MB)
- **Language Detection**: Automatically detects language from file extensions

### 🎯 **Supported Languages**
- **Web**: JavaScript, TypeScript, HTML, CSS
- **Backend**: Python, Java, C++, C, C#, PHP, Ruby, Go, Rust
- **Mobile**: Swift, Kotlin
- **Data**: SQL, JSON, XML
- **Text**: Plain text format

### 🚀 **Real-time Synchronization**
- **Instant Updates**: Messages appear immediately on all connected devices
- **Live Collaboration**: Multiple devices can share code simultaneously
- **No Refresh Needed**: Real-time Supabase subscriptions

## Usage Instructions

### Basic Code Sharing
1. Press `Ctrl + Shift + H` to open the hack page
2. Select your programming language from the dropdown
3. Paste or type your code in the text area
4. Press `Ctrl + Enter` or click "TRANSMIT" to share

### File Upload
1. Click the upload button (📁) in the toolbar
2. Select a code file (supports all major programming file types)
3. The content will load into the editor with language auto-detection
4. Click "TRANSMIT" to share

### Copy Code from Messages
1. Click the copy button (📋) on any message
2. The code is copied to your clipboard with perfect formatting
3. Paste directly into your IDE or editor

### Download Code as File
1. Click the download button (💾) on any message
2. File downloads with the appropriate extension based on language
3. Opens directly in your preferred code editor

## Keyboard Shortcuts
- `Ctrl + Shift + H`: Open hack page
- `Ctrl + Enter`: Send message
- `Tab`: Add indentation (4 spaces)

## Database Setup

### Automatic Migration
Run this SQL in your Supabase dashboard:

```sql
-- Create hack_messages table
CREATE TABLE IF NOT EXISTS hack_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS hack_messages_created_at_idx ON hack_messages(created_at DESC);

-- Enable RLS for anonymous access
ALTER TABLE hack_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access policies
CREATE POLICY "Allow anonymous read access to hack messages"
ON hack_messages FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to hack messages"
ON hack_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to hack messages"
ON hack_messages FOR DELETE USING (true);
```

### Automatic Cleanup
The system includes automatic cleanup features:
- **Message Limit**: Keeps only the latest 100 messages
- **Time-based Cleanup**: Option to remove messages older than 24 hours
- **Manual Clear**: Clear all messages button for fresh start

## Security Features
- **Anonymous**: No user data stored or tracked
- **Temporary**: Messages auto-expire after 24 hours
- **Size Limits**: File uploads limited to 1MB
- **Content Only**: No metadata or tracking information stored

## Use Cases

### 📱 **Device-to-Device Transfer**
Perfect for transferring code snippets between your phone and computer, or between different workstations.

### 👥 **Collaborative Debugging**
Share problematic code instantly with team members for quick debugging sessions.

### 📚 **Code Examples**
Share code examples during presentations or teaching sessions.

### 🔄 **Cross-Platform Development**
Transfer code between different development environments (Windows, Mac, Linux).

### 📋 **Quick Code Storage**
Temporary storage for code snippets you need to access across devices.

## Technical Details

### Real-time Updates
- Uses Supabase real-time subscriptions for instant message delivery
- Automatic reconnection handling for stable connections
- Optimistic UI updates for better user experience

### Code Preservation
- Preserves all whitespace and formatting exactly as typed
- Maintains tab characters and indentation levels
- No automatic code formatting or modification

### File Support
Supports uploading these file types:
- `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.c`, `.cs`
- `.html`, `.css`, `.sql`, `.php`, `.rb`, `.go`, `.rs`
- `.swift`, `.kt`, `.json`, `.xml`, `.txt`

## Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Clipboard API**: Required for copy functionality
- **File API**: Required for file upload functionality

## Tips for Best Experience

1. **Use Language Selection**: Always select the correct programming language for better readability
2. **Tab for Indentation**: Use Tab key instead of spaces for consistent indentation
3. **Ctrl+Enter**: Quick send with keyboard shortcut
4. **File Names**: When downloading, files are named with timestamp for easy organization
5. **Clear Regularly**: Use the clear button to remove old messages and maintain performance

---

**Happy Hacking! 🚀**

*Access the hack page anytime with `Ctrl + Shift + H`*