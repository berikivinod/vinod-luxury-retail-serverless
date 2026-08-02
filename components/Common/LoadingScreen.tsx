interface Props {
    text?: string;
}

export default function LoadingScreen({
    text = "Loading..."
}: Props) {

    return (
        <div
            style={{
                minHeight: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px"
            }}
        >
            {text}
        </div>
    );

}