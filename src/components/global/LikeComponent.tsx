import React from 'react';

interface IProps {
    dataHref: string;
}

const LikeComponent: React.FC<IProps> = ({ dataHref }) => {
    return (
        <div
            className="fb-like"
            data-href={dataHref}
            data-width=""
            data-layout=""
            data-action=""
            data-size=""
            data-share="true"
        ></div>
    );
};

export default LikeComponent;
