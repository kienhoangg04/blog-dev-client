import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormSubmit } from '../../utils/TypeScript';
import { loginSMS } from '../../redux/actions/authAction';

function LoginSMS() {
    const [phone, setPhone] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e: FormSubmit) => {
        e.preventDefault();
        dispatch(loginSMS(phone));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label htmlFor="phone" className="form-label">
                    Phone number
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder="+84 336 693 940"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-dark w-100" disabled={phone ? false : true}>
                Login
            </button>
        </form>
    );
}

export default LoginSMS;
