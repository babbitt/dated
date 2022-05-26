import './inlineComment.css'

export default class inlineComment {
    static isInline = true;

    static title = "Inline Comment"

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;

        this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }

    constructor({api, config}) {
        this.api = api;
        this.button = null;
        this._state = false;

        this.tag = 'ICOMMENT';
        this.class = 'cdx-icomment';

        this.user = config.user
    }

    render() {
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clip-rule="evenodd" /></svg>';
        this.button.classList.add(this.api.styles.inlineToolButton);

        return this.button;
    }

    surround(range) {
        if (this.state) {
            this.unwrap(range);
            return;
        }

        this.wrap(range);
    }

    wrap(range) {
        const selectedText = range.extractContents();
        const mark = document.createElement(this.tag);

        mark.classList.add(this.class);
        mark.appendChild(selectedText);
        mark.insertAdjacentText('afterend', '')

        const commenter = document.createElement('span')
        commenter.classList.add('commenter')
        commenter.setAttribute('username',this.user.name)
        commenter.textContent = this.user.name.slice(0,1)
        commenter.style.backgroundColor = this.user.color
        mark.appendChild(commenter)

        const comment = document.createElement('span')
        comment.classList.add('comment')
        mark.appendChild(comment)

        range.insertNode(mark);

        this.api.selection.expandToTag(mark);
    }

    unwrap(range) {
        const mark = this.api.selection.findParentTag(this.tag, this.class);

        const commenter = mark.querySelector('.commenter')

        const comment = mark.querySelector('.comment')
        const commentText = document.createElement(null)
        commentText.innerText = ` (${comment.innerText} - ${commenter.getAttribute('username')})`
        comment.remove()
        commenter.remove()

        const text = range.extractContents();
        text.appendChild(commentText)

        mark.remove();

        range.insertNode(text);
    }


    checkState() {
        const mark = this.api.selection.findParentTag(this.tag);

        this.state = !!mark;
        
        if (this.state) {
            this.showActions(mark);
        } else {
            this.hideActions();
        }
    }

    renderActions() {
        this.addedCommentI = document.createElement('input');
        this.addedCommentI.type = 'text';
        this.addedCommentI.classList.add('cdx-icomment-input')
        this.addedCommentI.placeholder = 'Your additional comment';
        this.addedCommentI.hidden = true;

        return this.addedCommentI;
    }

    showActions(mark) {
        this.addedCommentI.hidden = false;
        this.addedCommentI.select();
        this.addedCommentI.value = mark.querySelector('.comment').innerText;

        this.addedCommentI.onkeyup = () => {
            mark.querySelector('.comment').innerText = this.addedCommentI.value;
        };
    }

    hideActions() {
        this.addedCommentI.onkeyup = null;
        this.addedCommentI.hidden = true;
    }

    static get sanitize() {
        return {
            icomment: ({'style': true, 'class': true}),
            span: ({'style': true, 'class': true, 'username': true}),
        }
    }

}
