package web.network;

import web.exceptions.InvalidParamException;

import java.math.BigDecimal;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.ParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Request {
    private static final BigDecimal X_LOWER_BOUND = BigDecimal.valueOf(-5.0f);
    private static final BigDecimal X_UPPER_BOUND = BigDecimal.valueOf(5.0f);
    private static final List<Float> SUPPORTED_Y =
            Stream.iterate(-2.0f, seed -> seed + 0.5f)
                    .limit(9)
                    .toList();
    private static final List<Float> SUPPORTED_R =
            Stream.iterate(1.0f, seed -> seed + 0.5f)
                    .limit(5)
                    .toList();

    private final BigDecimal x;
    private final float y;
    private final float r;

    private Request(BigDecimal x, float y, float r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    public static Request parse(String raw) throws InvalidParamException {
        if (raw == null) {
            throw new InvalidParamException("Пустые параметры");
        }

        Map<String, String> params = Arrays.stream(raw.split("&"))
                .map(param -> param.split("="))
                .collect(Collectors.toMap(
                        param -> URLDecoder.decode(param[0], StandardCharsets.UTF_8),
                        param -> URLDecoder.decode(param[1], StandardCharsets.UTF_8)
                ));

        try {
            BigDecimal x = parseFloat(params.get("x"));
            float y = Float.parseFloat(params.get("y"));
            float r = Float.parseFloat(params.get("r"));

            if (x.compareTo(X_LOWER_BOUND) <= 0 || x.compareTo(X_UPPER_BOUND) >= 0
                    || !SUPPORTED_Y.contains(y) || !SUPPORTED_R.contains(r)) {
                throw new InvalidParamException("Числа вне границ");
            }

            return new Request(x, y, r);
        } catch (NullPointerException e) {
            throw new InvalidParamException("Неполные параметры", e);
        } catch (NumberFormatException | ParseException e) {
            throw new InvalidParamException("неверный формат числа", e);
        }
    }

    private static BigDecimal parseFloat(String value) throws ParseException {
        if (value.contains(".")) {
            DecimalFormat decimalFormat = new DecimalFormat();
            DecimalFormatSymbols symbols = new DecimalFormatSymbols();
            symbols.setDecimalSeparator('.');
            decimalFormat.setParseBigDecimal(true);
            decimalFormat.setDecimalFormatSymbols(symbols);

            return (BigDecimal) decimalFormat.parse(value);
        }

        DecimalFormat decimalFormat = new DecimalFormat();
        DecimalFormatSymbols symbols = new DecimalFormatSymbols();
        symbols.setDecimalSeparator(',');
        decimalFormat.setParseBigDecimal(true);
        decimalFormat.setDecimalFormatSymbols(symbols);

        return (BigDecimal) decimalFormat.parse(value);
    }

    public BigDecimal getX() {
        return x;
    }

    public float getY() {
        return y;
    }

    public float getR() {
        return r;
    }
}
