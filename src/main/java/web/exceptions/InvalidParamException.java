package web.exceptions;

public class InvalidParamException extends Exception {
    public InvalidParamException(String message) {
        super(message);
    }
    public InvalidParamException(String message, Throwable e) {
        super(message, e);
    }
}
