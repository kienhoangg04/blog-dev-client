import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

import { IBlog, RootStore, IUser, IComment } from '../../utils/TypeScript';

import Comments from '../comments/Comments';
import Input from '../comments/Input';
import Loading from '../global/Loading';
import Pagination from '../global/Pagination';

import { createComment, getComments } from '../../redux/actions/commentAction';
import LikeComponent from '../global/LikeComponent';
import { initFacebookSDK } from '../../utils/initfacebookSDK';
import { updateBlog } from '../../redux/actions/blogAction';

interface IProps {
    blog: IBlog;
}

const DisplayBlog: React.FC<IProps> = ({ blog }) => {
    const { auth, comments } = useSelector((state: RootStore) => state);
    const dispatch = useDispatch();

    const [showComments, setShowComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [onComment, setOnComment] = useState(blog.onComment);

    const history = useHistory();

    // create comment
    const handleComment = (body: string) => {
        if (!auth.user || !auth.access_token) return;

        const data = {
            content: body,
            user: auth.user,
            blog_id: blog._id as string,
            blog_user_id: (blog.user as IUser)._id,
            replyCM: [],
            createdAt: new Date().toISOString(),
        };

        setShowComments([data, ...showComments]);
        dispatch(createComment(data, auth.access_token));
    };

    // show ui comment
    useEffect(() => {
        setShowComments(comments.data);
    }, [comments.data]);

    // get comment
    const fetchComments = useCallback(
        async (id: string, num = 1) => {
            setLoading(true);
            await dispatch(getComments(id, num));
            setLoading(false);
        },
        [dispatch],
    );

    useEffect(() => {
        if (!blog._id) return;
        const num = history.location.search.slice(6) || 1;
        fetchComments(blog._id, num);
    }, [blog._id, fetchComments, history]);

    const handlePagination = (num: number) => {
        if (!blog._id) return;
        fetchComments(blog._id, num);
    };

    const handleOnComment = () => {
        setOnComment(!onComment);
        if (!auth.access_token) return;
        const newData = { ...blog, onComment };
        dispatch(updateBlog(newData, auth.access_token));
    };

    useEffect(() => {
        initFacebookSDK();
    }, []);

    return (
        <div>
            <h2 className="text-center my-3 text-capitalize fs-1" style={{ color: '#ff7a00' }}>
                {blog.title}
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between' , flexDirection: 'column'}}>
                <div className="text-end fst-italic" style={{ color: 'teal' }}>
                    <small>{typeof blog.user !== 'string' && `By: ${blog.user.name}`}</small>
                    <small className="ms-2">{new Date(blog.createdAt).toLocaleString()}</small>
                </div>
                <LikeComponent dataHref={`https://blogcanhan.online/blog/${blog._id}`} />
            </div>

            <div
                dangerouslySetInnerHTML={{
                    __html: blog.content,
                }}
            />

            <hr className="my-1" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#ff7a00' }}>&#10032; Comments &#10032;</h3>
                {typeof blog.user !== 'string' && blog.user._id === auth.user?._id && (
                    <button className="btn btn-warning" style={{ minWidth: '165px' }} onClick={handleOnComment}>
                        {onComment ? 'Turn off comments' : 'Turn on comments'}
                    </button>
                )}
            </div>

            {auth.user ? (
                onComment ? (
                    <Input callback={handleComment} />
                ) : (
                    <h5 style={{ color: 'red', textAlign: 'center' }}>Commenting has been disabled</h5>
                )
            ) : (
                <h5>
                    Please <Link to={`/login?blog/${blog._id}`}>login</Link> to comment.
                </h5>
            )}

            {loading ? (
                <Loading />
            ) : (
                showComments?.map((comment, index) => (
                    <Comments key={index} comment={comment} onComment={!!onComment} />
                ))
            )}

            {comments.total > 1 && <Pagination total={comments.total} callback={handlePagination} />}
        </div>
    );
};

export default DisplayBlog;
