import Error from "next/error";

export default function NotFound() {
    // Opinionated: do not record an exception in Sentry for 404
    return (
        <div className="error-page">
            <img src="/static/images/error-404.png" alt="404" className="img-fluid" />
        </div>
    );
}
