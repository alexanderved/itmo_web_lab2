package web.network;

import java.time.LocalDateTime;
import java.util.Locale;

public class ErrorResponse extends Response {
    private static final String RESULT_TEMPLATE = """
            HTTP/1.1 400 Bad Request
            Content-Type: application/json
            Content-Length: %d
            
            %s
            """;

    private static final String RESULT_BODY_TEMPLATE = """
            {
                "currentTime": "%s",
                "reason": "%s"
            }
            """;

    private final LocalDateTime currentTime = LocalDateTime.now();
    private final String reason;

    public ErrorResponse(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    @Override
    public String format() {
        String body = String.format(Locale.US, RESULT_BODY_TEMPLATE, currentTime, reason);

        return String.format(Locale.US, RESULT_TEMPLATE, body.length(), body);
    }
}
