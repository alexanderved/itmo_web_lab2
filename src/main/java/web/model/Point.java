package web.model;

import java.math.BigDecimal;

public record Point(BigDecimal x, BigDecimal y, BigDecimal r, boolean isHit) {

}
