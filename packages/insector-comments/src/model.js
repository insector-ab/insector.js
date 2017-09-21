import {modelIdentities, modelRegistry} from 'mozy';
import {ViewModel} from 'insector-react-mvc';
import {FormModel} from 'insector-form';

/**
 * CommentsModel
 */
export default class CommentsModel extends ViewModel {

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
        return modelRegistry.getModel(this.get('commentForm'));
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = CommentsModel.identity;
        d.showNewComment = false;
        d.showAll = false;
        d.commentForm = (new FormModel({
            inputs: [
                {
                    name: 'text',
                    validation: ['required', {key: 'minChars', args: [1]}]
                }
            ]
        })).getModelData();
        return d;
    }

}
CommentsModel.identity = 'insector.CommentsModel';

// ****** Identity & Registry *****

modelIdentities.set(CommentsModel.identity, CommentsModel);
