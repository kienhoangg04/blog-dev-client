import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IParams } from '../../utils/TypeScript';
import { postAPI } from '../../utils/fetchData';
import { showErrMsg, showSuccessMsg } from '../../components/alert/Alert';

function Active() {
    const { slug }: IParams = useParams();
    const [success, setSuccess] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        if (slug) {
            postAPI('active', { active_token: slug })
                .then((res) => setSuccess(res.data.msg))
                .catch((err) => setErr(err.response.data.msg));
        }
    }, [slug]);

    return (
        <div>
            {success && showSuccessMsg(success)}
            {err && showErrMsg(err)}
        </div>
    );
}

export default Active;
