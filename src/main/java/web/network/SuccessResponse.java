package web.network;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Locale;

public class SuccessResponse extends Response {
    private static final String RESULT_TEMPLATE = """
            HTTP/1.1 200 OK
            Content-Type: application/json
            Content-Length: %d
            
            %s
            """;

    private static final String RESULT_BODY_TEMPLATE = """
            {
                "hit": %b,
                "currentTime": "%s",
                "executionTime": "%s"
            }
            """;

    private final boolean hit;
    private final LocalDateTime currentTime = LocalDateTime.now();
    private final Duration executionTime;

    public SuccessResponse(boolean hit, Duration executionTime) {
        this.hit = hit;
        this.executionTime = executionTime;
    }

    @Override
    public String format() {
        String body = String.format(Locale.US,
                RESULT_BODY_TEMPLATE, hit, currentTime,
                String.format(Locale.US, "%d ns", executionTime.toNanos()));

        return String.format(Locale.US, RESULT_TEMPLATE, body.length(), body);
    }
}
