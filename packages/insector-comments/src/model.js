import {ModelRegistry, modelFactory, modelIdentities} from 'mozy';
import {ViewModel} from 'insector-react-mvc';
import {FormViewModel} from 'insector-form';

/**
 * CommentsModel
 */
export default class CommentsModel extends ViewModel {

    constructor(data) {
        super(data);
        // local model registry
        this._localRegistry = new ModelRegistry('uuid', modelFactory);
    }

    get showNewComment() {
        return this.get('showNewComment');
    }
    set showNewComment(value) {
        this.set('showNewComment', value);
    }

    get showAll() {
        return this.get('showAll');
    }
    set showAll(value) {
        this.set('showAll', value);
    }

    get commentForm() {
        if (this.has('commentForm')) {
            return this._localRegistry.getModel(this.get('commentForm'));
        }
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = CommentsModel.identity;
        d.showNewComment = false;
        d.showAll = false;
        d.commentForm = {identity: FormViewModel.identity};
        return d;
    }

    _deleteReferences() {
        super._deleteReferences();
        delete this._localRegistry;
    }

}
CommentsModel.identity = 'insector.CommentsModel';

// ****** Identity & Registry *****

modelIdentities.set(CommentsModel.identity, CommentsModel);
