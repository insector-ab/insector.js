import $ from 'jquery';
import ReactController from '../controller';

/**
 * ModuleController
 */
export default class ModuleController extends ReactController {

    // Called when component will mount and ModuleModel is not initialized
    // intialize should always return a promise
    // Override and do stuff
    initialize() {
        return $.Deferred().resolve().promise();
    }

    // Called when component is mounted and initialized promise is resolved
    // Override and do stuff
    launch() {
        // ABSTRACT
    }

}
