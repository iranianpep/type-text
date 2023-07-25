const config = {
    lowDelay: 0,
    highDelay: 15,
    highlightColor: '#ffff42',
    transparentColor: '#0000',
    hasEffectIfLessThan: 300
};

function printComment(data) {
    content = data['body'];
    contentLength = content.length;
    delay = contentLength <= config.hasEffectIfLessThan ? config.highDelay : config.lowDelay

    highlights = data['highlights'];

    let flatArray;
    if (highlights) {
        flatArray = highlights.map((highlight) => {
            return [highlight['start'], highlight['end']];
        }).flat();
    }

    document.getElementById('comment-author').innerHTML = '';
    document.getElementById('comment-body').innerHTML = '';

    highlight = false;
    let backgroundColor = config.transparentColor;
    const ele = '<span>"' + content.split('').join('</span><span>') + '"</span>';
    $(ele).hide().appendTo('#comment-body').each(function (i) {
        if (flatArray && flatArray.includes(i)) {
            highlight = highlight ? false : true;
            backgroundColor = highlight ? config.highlightColor : config.transparentColor;
        }

        $(this).delay(delay * i).css({
            display: 'inline',
            opacity: 0,
            "background-color": backgroundColor
        }).animate({
            opacity: 1
        }, delay);
    });

    if (data['author']) {
        document.getElementById('comment-author').innerHTML = data['author'] + ':';
    }
}

async function getCommentById(id) {
    const response = await fetch('http://localhost:8000/comments/' + id.toString());

    return await response.json();
}

$(document).ready(async function() {
    localStorage.setItem('currentId', 0);

    document.onkeydown = async function (e) {
        let id = parseInt(localStorage.getItem('currentId'));

        switch (e.key) {
            case 'ArrowLeft':
                id = id - 1;
                comment = await getCommentById(id);
                printComment(comment);

                localStorage.setItem('currentId', id);
                break;
            case 'ArrowRight':
                id = id + 1;
                comment = await getCommentById(id);
                printComment(comment);

                localStorage.setItem('currentId', id);
                break;
        }
    };
});