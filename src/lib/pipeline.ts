import { pipeline } from '@xenova/transformers';

// Define the type for the global variable
declare global {
    var pipelineInstance: Promise<any> | undefined;
}

class PipelineSingleton {
    static task = 'automatic-speech-recognition' as const;
    // static model = 'Xenova/whisper-base';
    static model = 'Xenova/whisper-small';

    static async getInstance(progress_callback?: Function) {
        if (!globalThis.pipelineInstance) {
            console.log('Initializing new pipeline instance...');
            globalThis.pipelineInstance = pipeline(this.task, this.model, { progress_callback });
        } else {
            console.log('Using existing pipeline instance.');
        }
        return globalThis.pipelineInstance;
    }
}

export default PipelineSingleton;
