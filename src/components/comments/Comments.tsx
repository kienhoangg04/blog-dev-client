import React, { useState, useEffect } from 'react';
import { IComment } from '../../utils/TypeScript';

import AvatarComment from './AvatarComment';
import CommentList from './CommentList';
import AvatarReply from './AvatarReply';

interface IProps {
    comment: IComment;
    onComment: boolean;
}

const Comments: React.FC<IProps> = ({ comment, onComment }) => {
    const [showReply, setShowReply] = useState<IComment[]>([]);
    const [next, setNext] = useState(2);

    useEffect(() => {
        if (!comment.replyCM) return;
        setShowReply(comment.replyCM);
    }, [comment.replyCM]);

    return (
        <div
            className="my-3 d-flex"
            style={{
                opacity: comment._id ? 1 : 0.5,
                pointerEvents: comment._id ? 'initial' : 'none',
            }}
        >
            {/* Comment */}
            <AvatarComment user={comment.user} />
            <CommentList comment={comment} showReply={showReply} setShowReply={setShowReply} onComment={onComment}>
                {/* Commnet chidren */}
                {showReply.slice(0, next).map((comment, index) => (
                    <div
                        key={index}
                        style={{
                            opacity: comment._id ? 1 : 0.5,
                            pointerEvents: comment._id ? 'initial' : 'none',
                        }}
                    >
                        <AvatarReply user={comment.user} reply_user={comment.reply_user} />
                        <CommentList
                            comment={comment}
                            showReply={showReply}
                            setShowReply={setShowReply}
                            onComment={onComment}
                        />
                    </div>
                ))}

                <div style={{ cursor: 'pointer' }}>
                    {showReply.length > 0 && next < showReply.length ? (
                        <small style={{ color: 'crimson' }} onClick={() => setNext(next + 5)}>
                            See more comments...
                        </small>
                    ) : (
                        showReply.length > 2 && (
                            <small style={{ color: 'teal' }} onClick={() => setNext(2)}>
                                Hide comments...
                            </small>
                        )
                    )}
                </div>
            </CommentList>
        </div>
    );
};

export default Comments;
