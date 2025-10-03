package web;

import web.exceptions.InvalidParamException;
import web.network.ErrorResponse;
import web.network.Request;
import web.network.Response;
import web.network.SuccessResponse;

import java.time.Duration;
import java.time.Instant;

public class RequestHandler {
    public static Response handle(String rawReq) {
        try {
            Request req = Request.parse(rawReq);

            Instant startTime = Instant.now();
            boolean hit = Calculator.calculateHit(req.getX(), req.getY(), req.getR());
            Duration executionTime = Duration.between(startTime, Instant.now());

            return new SuccessResponse(hit, executionTime);
        } catch (InvalidParamException e) {
            return new ErrorResponse(e.getMessage());
        }
    }
}
