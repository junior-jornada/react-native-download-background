
# fork on react-native-download-background

## Getting started

`$ npm install react-native-download-background --save`

### Mostly automatic installation

`$ react-native link react-native-download-background`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-download-background` and add `RNDownloadBackground.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNDownloadBackground.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import net.weg.downloadBackground.RNDownloadBackgroundPackage;` to the imports at the top of the file
  - Add `new RNDownloadBackgroundPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-download-background'
  	project(':react-native-download-background').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-download-background/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-download-background')
  	```


## Usage
```javascript
import RNDownloadBackground from 'react-native-download-background';

// TODO: What to do with the module?
RNDownloadBackground;
```
  
