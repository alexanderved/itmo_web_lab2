package web.exceptions;

public class PointParserException extends Exception {
    public PointParserException(String message) {
        super(message);
    }
    public PointParserException(String message, Throwable e) {
        super(message, e);
    }
}
