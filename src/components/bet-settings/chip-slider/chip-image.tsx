import { buildVersion } from "../../../common/constants";

export const ChipImage: React.FC<{ color: string; className: string; width?: string; height?: string }> = ({
    color,
    className,
    width,
    height,
}) => {
    const onError = ({ currentTarget }) => {
        currentTarget.onerror = null;
        currentTarget.src = `/static/images/chips/chip-default.svg`;
    };

    return (
        <img
            src={`/static/images/chips/chip-${color?.replace("#", "")}.svg?v=${buildVersion}`}
            className={className}
            width={width}
            height={height}
            alt="Chip"
            onError={onError}
        />
    );
};
