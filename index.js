import { NativeModules, NativeEventEmitter } from 'react-native';
const { RNDownloadBackground } = NativeModules;
const RNDownloadBackgroundEmitter = new NativeEventEmitter(RNDownloadBackground);
import DownloadTask from './lib/downloadTask';

const tasksMap = new Map();
let headers = {};

RNDownloadBackgroundEmitter.addListener('downloadProgress', events => {
    for (let event of events) {
        let task = tasksMap.get(event.id);
        if (task) {
            task._onProgress(event.percent, event.written, event.total);
        }
    }
});

RNDownloadBackgroundEmitter.addListener('downloadComplete', event => {
    let task = tasksMap.get(event.id);
    if (task) {
        task._onDone(event.location);
    }
    tasksMap.delete(event.id);
});

RNDownloadBackgroundEmitter.addListener('downloadFailed', event => {
    console.log(event);
    let task = tasksMap.get(event.id);
    if (task) {
        task._onError(event.error, event.errorcode);
    }
    tasksMap.delete(event.id);
});

RNDownloadBackgroundEmitter.addListener('downloadBegin', event => {
    let task = tasksMap.get(event.id);
    if (task) {
        task._onBegin(event.expectedBytes);
    }
});

export function setHeaders(h = {}) {
    if (typeof h !== 'object') {
        throw new Error('[RNDownloadBackground] headers must be an object');
    }
    headers = h;
}

export function checkForExistingDownloads() {
    return RNDownloadBackground.checkForExistingDownloads()
        .then(foundTasks => {
            return foundTasks.map(taskInfo => {
                let task = new DownloadTask(taskInfo);
                if (taskInfo.state === RNDownloadBackground.TaskRunning) {
                    task.state = 'DOWNLOADING';
                } else if (taskInfo.state === RNDownloadBackground.TaskSuspended) {
                    task.state = 'PAUSED';
                } else if (taskInfo.state === RNDownloadBackground.TaskCanceling) {
                    task.stop();
                    return null;
                } else if (taskInfo.state === RNDownloadBackground.TaskCompleted) {
                    if (taskInfo.bytesWritten === taskInfo.totalBytes) {
                        task.state = 'DONE';
                    } else {
                        // IOS completed the download but it was not done.
                        return null;
                    }
                }
                tasksMap.set(taskInfo.id, task);
                return task;
            }).filter(task => task !== null);
        });
}

export function download(options) {
    if (!options.id || !options.url || !options.destination) {
        throw new Error('[RNDownloadBackground] id, url and destination are required');
    }
    if (options.headers && typeof options.headers === 'object') {
        options.headers = {
            ...headers,
            ...options.headers
        };
    } else {
        options.headers = headers;
    }
    RNDownloadBackground.download(options);
    let task = new DownloadTask(options.id);
    tasksMap.set(options.id, task);
    return task;
}

export const directories = {
    documents: RNDownloadBackground.documents
};

export const Network = {
    WIFI_ONLY: RNDownloadBackground.OnlyWifi,
    ALL: RNDownloadBackground.AllNetworks
};

export const Priority = {
    HIGH: RNDownloadBackground.PriorityHigh,
    MEDIUM: RNDownloadBackground.PriorityNormal,
    LOW: RNDownloadBackground.PriorityLow
};

export default {
    download,
    checkForExistingDownloads,
    setHeaders,
    directories,
    Network,
    Priority
};
