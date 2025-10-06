// src/pages/user/OrderConfirmation.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { API_BASE_URL } from "../../config";

/* Utility: normalize numbers (accept cents or dollars) */
function parseMoneyToDollars(value) {
  if (value == null) return 0;
  const n = Number(value);
  if (!isFinite(n)) return 0;
  if (Number.isInteger(n) && Math.abs(n) >= 1000) return n / 100;
  return n;
}

function fmtCurrencyNZD(amount) {
  const n = Number(amount || 0);
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(n);
}

const resolveImage = (item) => {
  if (!item) return "";
  if (item.preparedPreview) return item.preparedPreview;
  if (item.uploadedUrl) return item.uploadedUrl;
  if (item.image) return typeof item.image === "string" ? item.image : (item.image.url || item.image.path || "");
  if (Array.isArray(item.images) && item.images.length) {
    const f = item.images[0];
    return typeof f === "string" ? f : (f?.url || f?.path || "");
  }
  return "";
};

const readOption = (item, key) => {
  if (!item) return null;
  const v = item[key] ?? item.options?.[key] ?? item.raw?.[key] ?? item.custom?.[key] ?? item.selected?.[key];
  if (v == null) return null;
  if (typeof v === "object") return v.name ?? v.label ?? v.value ?? JSON.stringify(v);
  return String(v);
};

export default function OrderConfirmation() {
  const location = useLocation();
  const state = location.state || {};
  const [order, setOrder] = useState(state.order || null);
  const [loading, setLoading] = useState(false);
  const orderIdFromState = state.orderId || state.order?._id || null;

  useEffect(() => {
    if (!orderIdFromState) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/order/${encodeURIComponent(orderIdFromState)}`, { credentials: "include" });
        if (!res.ok) {
          console.warn("OrderConfirmation fetch failed", res.status);
          setLoading(false);
          return;
        }
        const payload = await res.json().catch(() => null);
        const orderObj = payload?.order ?? payload?.data ?? payload;
        if (!cancelled) {
          setOrder(orderObj || null);
          console.group("[OrderConfirmation] fetched order");
          console.log(orderObj);
          console.groupEnd();
        }
      } catch (err) {
        console.error("OrderConfirmation fetch error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderIdFromState]);

  const items = (order?.orderItems || state.items || state.products || []).map(i => {
    const itemObj = i || {};
    const quantity = Number(itemObj.quantity ?? itemObj.qty ?? 1) || 1;
    const rawLineTotal = itemObj.lineTotal ?? itemObj.line_total ?? itemObj.total ?? itemObj.unitTotal ?? itemObj.priceForQty ?? itemObj.subtotal ?? itemObj.amount ?? null;
    const rawUnitPrice = itemObj.unitPrice ?? itemObj.pricePerUnit ?? itemObj.price_unit ?? itemObj.price ?? itemObj.basePrice ?? itemObj.product?.price ?? null;
    const parsedLine = parseMoneyToDollars(rawLineTotal);
    const parsedUnit = parseMoneyToDollars(rawUnitPrice);
    const lineTotal = (parsedLine && parsedLine > 0) ? parsedLine : (parsedUnit > 0 ? Number((parsedUnit).toFixed(2)) : 0);
    const unitPrice = (parsedUnit && parsedUnit > 0) ? parsedUnit : (quantity > 0 ? Number((lineTotal / quantity).toFixed(4)) : 0);

    return {
      raw: itemObj,
      name: itemObj.name || itemObj.title || itemObj.productName || itemObj.product?.name || "Product",
      quantity,
      lineTotal,
      unitPrice,
      image: resolveImage(itemObj),
      size: readOption(itemObj, "size"),
      paper: readOption(itemObj, "paper"),
      finish: readOption(itemObj, "finish"),
      corner: readOption(itemObj, "corner"),
    };
  });

  const totalDollars = (() => {
    const serverTotal = parseMoneyToDollars(order?.totalPrice ?? order?.total ?? 0);
    let itemsSubtotal = parseMoneyToDollars(order?.itemsPrice ?? order?.subtotal ?? 0);
    if (!itemsSubtotal || itemsSubtotal === 0) {
      const computed = items.reduce((acc, it) => {
        if (it.lineTotal && it.lineTotal > 0) return acc + Number(it.lineTotal);
        return acc + Number(((it.unitPrice || 0) * (it.quantity || 1)).toFixed(2));
      }, 0);
      itemsSubtotal = Number(computed.toFixed(2));
    }
    const rawShipping = Number(order?.shippingPrice ?? order?.shipping ?? 0);
    let shipping = parseMoneyToDollars(rawShipping);
    if (rawShipping >= 100 && itemsSubtotal < 1000) {
      shipping = Number((rawShipping / 100).toFixed(2));
    }
    const tax = parseMoneyToDollars(order?.taxPrice ?? order?.tax ?? 0);
    const discount = parseMoneyToDollars(order?.discountAmount ?? order?.discount ?? 0);
    const computedTotal = Number((itemsSubtotal + shipping + tax - discount).toFixed(2));
    if (serverTotal && Math.abs(serverTotal - computedTotal) < 0.01) {
      return Number(serverTotal.toFixed(2));
    }
    return computedTotal;
  })();

  useEffect(() => {
    if (!order) return;
    const serverTotal = parseMoneyToDollars(order?.totalPrice ?? order?.total ?? 0);
    const computedItemSum = items.reduce((a, i) => a + (i.lineTotal || (i.unitPrice) || 0), 0);
    if (serverTotal && Math.abs(serverTotal - computedItemSum) > 0.009) {
      console.warn("[OrderConfirmation] mismatch", serverTotal, computedItemSum);
    }
  }, [order, items]);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading order…</div>;

  return (
    <div className="responsive-container">
      <Header />
      
      {/* Order Confirmation Section - Same alignment as Personalized Gifts */}
      <section style={{  padding: "1.875rem 0 2.5rem", textAlign: "center", marginLeft: "7%", marginRight: "10%" }}>
        <style>{`
          @media (max-width: 1023px) {
            section[style*="marginLeft"] {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }

          .confirmation-title-responsive {
            font-size: 32px;
            margin-bottom: 12px;
            font-weight: 700;
            color: #111;
          }

          @media (max-width: 767px) {
            .confirmation-title-responsive {
              font-size: 24px;
            }
          }

          .confirmation-subtitle-responsive {
            font-size: 17px;
            color: #555;
            margin-bottom: 30px;
            max-width: 700px;
            margin-inline: auto;
            line-height: 1.6;
          }

          @media (max-width: 767px) {
            .confirmation-subtitle-responsive {
              font-size: 15px;
              margin-bottom: 20px;
              padding: 0 0.5rem;
            }
          }

          .order-content-container-responsive {
            max-width: 75%;
            margin: 0 auto;
            padding: 0 1rem;
          }

          @media (max-width: 1023px) {
            .order-content-container-responsive {
              max-width: 100%;
              margin: 0;
              padding: 0 0.5rem;
            }
          }

          .success-icon-responsive {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            margin: 0 auto 12px;
            background: #e6fffa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: #047857;
          }

          @media (max-width: 767px) {
            .success-icon-responsive {
              width: 64px;
              height: 64px;
              border-radius: 32px;
              font-size: 28px;
            }
          }

          .order-card-responsive {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 0.375rem 1.5rem rgba(0,0,0,0.06);
            overflow: hidden;
            margin-bottom: 24px;
          }

          @media (max-width: 767px) {
            .order-card-responsive {
              border-radius: 8px;
            }
          }

          .order-header-responsive {
            padding: 20px;
            border-bottom: 1px solid #f1f5f9;
          }

          @media (max-width: 767px) {
            .order-header-responsive {
              padding: 16px;
            }
          }

          .order-header-grid-responsive {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }

          @media (max-width: 767px) {
            .order-header-grid-responsive {
              gap: 16px;
            }
          }

          .order-header-item-responsive strong {
            display: block;
            margin-bottom: 4px;
            font-size: 15px;
          }

          @media (max-width: 767px) {
            .order-header-item-responsive strong {
              font-size: 14px;
            }
          }

          .order-header-item-responsive div {
            color: #6b7280;
            font-size: 14px;
          }

          @media (max-width: 767px) {
            .order-header-item-responsive div {
              font-size: 13px;
            }
          }

          .order-body-responsive {
            padding: 20px;
          }

          @media (max-width: 767px) {
            .order-body-responsive {
              padding: 16px;
            }
          }

          .order-body-responsive h3 {
            margin-top: 0;
            font-size: 18px;
            font-weight: 700;
            text-align: left;
          }

          @media (max-width: 767px) {
            .order-body-responsive h3 {
              font-size: 16px;
            }
          }

          .order-item-responsive {
            display: flex;
            gap: 16px;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }

          .order-item-responsive:last-child {
            border-bottom: none;
          }

          @media (max-width: 767px) {
            .order-item-responsive {
              gap: 12px;
              padding: 10px 0;
            }
          }

          .order-item-image-responsive {
            width: 86px;
            height: 86px;
            border-radius: 8px;
            overflow: hidden;
            background: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          @media (max-width: 767px) {
            .order-item-image-responsive {
              width: 64px;
              height: 64px;
              border-radius: 6px;
            }
          }

          .order-item-image-responsive img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .order-item-details-responsive {
            flex: 1;
            min-width: 0;
            text-align: left;
          }

          .order-item-name-responsive {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
          }

          @media (max-width: 767px) {
            .order-item-name-responsive {
              font-size: 14px;
              margin-bottom: 6px;
            }
          }

          .order-item-options-responsive {
            color: #6b7280;
            margin-top: 8px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            font-size: 14px;
          }

          @media (max-width: 767px) {
            .order-item-options-responsive {
              gap: 8px;
              font-size: 13px;
            }
          }

          .order-item-price-container-responsive {
            text-align: right;
            flex-shrink: 0;
          }

          .order-item-price-responsive {
            font-weight: 700;
            font-size: 16px;
          }

          @media (max-width: 767px) {
            .order-item-price-responsive {
              font-size: 14px;
            }
          }

          .order-item-unit-price-responsive {
            color: #6b7280;
            font-size: 13px;
            margin-top: 2px;
          }

          @media (max-width: 767px) {
            .order-item-unit-price-responsive {
              font-size: 12px;
            }
          }

          .order-totals-responsive {
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px solid #eef2f7;
          }

          .order-totals-row-responsive {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 15px;
          }

          @media (max-width: 767px) {
            .order-totals-row-responsive {
              font-size: 14px;
            }
          }

          .order-totals-row-responsive.total {
            padding-top: 10px;
            border-top: 1px solid #eef2f7;
            margin-top: 6px;
          }

          .order-totals-label-responsive {
            color: #6b7280;
          }

          .order-totals-value-responsive {
            font-weight: 700;
          }

          .order-totals-total-responsive {
            font-size: 20px;
            font-weight: 800;
            color: #0369a1;
          }

          @media (max-width: 767px) {
            .order-totals-total-responsive {
              font-size: 18px;
            }
          }

          .order-actions-responsive {
            margin-top: 24px;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }

          @media (max-width: 767px) {
            .order-actions-responsive {
              margin-top: 20px;
              gap: 10px;
            }
          }

          .btn-primary-responsive {
            padding: 12px 20px;
            background: #0369a1;
            color: #fff;
            border-radius: 8px;
            border: none;
            font-size: 15px;
            cursor: pointer;
            transition: background 0.2s ease;
          }

          .btn-primary-responsive:hover {
            background: #075985;
          }

          @media (max-width: 767px) {
            .btn-primary-responsive {
              padding: 10px 18px;
              font-size: 14px;
            }
          }

          .btn-secondary-responsive {
            padding: 12px 20px;
            background: transparent;
            color: #0369a1;
            border: 2px solid #e6f2fb;
            border-radius: 8px;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-secondary-responsive:hover {
            border-color: #0369a1;
            background: #f0f9ff;
          }

          @media (max-width: 767px) {
            .btn-secondary-responsive {
              padding: 10px 18px;
              font-size: 14px;
            }
          }

          .error-icon-responsive {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            margin: 0 auto 12px;
            background: #fef3f2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: #b91c1c;
          }

          @media (max-width: 767px) {
            .error-icon-responsive {
              width: 64px;
              height: 64px;
              border-radius: 32px;
              font-size: 28px;
            }
          }

          .error-container-responsive {
            text-align: center;
            padding: 60px 20px;
          }

          @media (max-width: 767px) {
            .error-container-responsive {
              padding: 40px 16px;
            }
          }

          .error-container-responsive h2 {
            font-size: 22px;
            margin-bottom: 12px;
          }

          @media (max-width: 767px) {
            .error-container-responsive h2 {
              font-size: 18px;
            }
          }
        `}</style>

        <div className="order-content-container-responsive">
          {order || state.orderId ? (
            <>
              <div style={{ marginBottom: 36 }}>
                <div className="success-icon-responsive">✓</div>
                <h1 className="confirmation-title-responsive">Order Confirmed!</h1>
                <p className="confirmation-subtitle-responsive">Thanks – we received your order and will begin processing it.</p>
              </div>

              <div className="order-card-responsive">
                <div className="order-header-responsive">
                  <div className="order-header-grid-responsive">
                    <div className="order-header-item-responsive">
                      <strong>Order ID</strong>
                      <div>{order?._id ?? state.orderId}</div>
                    </div>
                    <div className="order-header-item-responsive">
                      <strong>Date</strong>
                      <div>{new Date(order?.createdAt || state.date || Date.now()).toLocaleString()}</div>
                    </div>
                    <div className="order-header-item-responsive">
                      <strong>Status</strong>
                      <div>{order?.status ?? "Pending"}</div>
                    </div>
                  </div>
                </div>

                <div className="order-body-responsive">
                  <h3>Order Summary</h3>
                  <div>
                    {items.length === 0 ? (
                      <div style={{ color: "#6b7280" }}>No items available</div>
                    ) : (
                      items.map((it, idx) => (
                        <div key={idx} className="order-item-responsive">
                          <div className="order-item-image-responsive">
                            {it.image ? (
                              <img src={it.image} alt={it.name} />
                            ) : (
                              <div style={{ color: "#9ca3af" }}>No image</div>
                            )}
                          </div>

                          <div className="order-item-details-responsive">
                            <div className="order-item-name-responsive">{it.name}</div>
                            <div className="order-item-options-responsive">
                              <div>Qty: {it.quantity}</div>
                              <div>Size: {it.size ?? "N/A"}</div>
                              <div>Paper: {it.paper ?? "N/A"}</div>
                              <div>Finish: {it.finish ?? "N/A"}</div>
                              <div>Corner: {it.corner ?? "N/A"}</div>
                            </div>
                          </div>

                          <div className="order-item-price-container-responsive">
                            <div className="order-item-price-responsive">
                              {fmtCurrencyNZD(
                                (it.lineTotal && it.lineTotal > 0)
                                  ? it.lineTotal
                                  : ((it.unitPrice && it.quantity) ? Number((it.unitPrice * it.quantity).toFixed(2)) : it.unitPrice || 0)
                              )}
                            </div>
                            {(it.unitPrice && it.quantity && Math.abs((it.lineTotal || (it.unitPrice * it.quantity)) / it.quantity - it.unitPrice) < 0.01) ? (
                              <div className="order-item-unit-price-responsive">{fmtCurrencyNZD(it.unitPrice)} / unit</div>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="order-totals-responsive">
                    <div className="order-totals-row-responsive">
                      <div className="order-totals-label-responsive">Items</div>
                      <div className="order-totals-value-responsive">
                        {fmtCurrencyNZD(
                          (() => {
                            const serverItems = parseMoneyToDollars(order?.itemsPrice ?? order?.subtotal ?? 0);
                            if (serverItems && serverItems > 0) return serverItems;
                            const computed = items.reduce((acc, it) => {
                              if (it.lineTotal && it.lineTotal > 0) return acc + Number(it.lineTotal);
                              return acc + Number(((it.unitPrice || 0) * (it.quantity || 1)).toFixed(2));
                            }, 0);
                            return Number(computed.toFixed(2));
                          })()
                        )}
                      </div>
                    </div>

                    <div className="order-totals-row-responsive">
                      <div className="order-totals-label-responsive">Shipping</div>
                      <div className="order-totals-value-responsive">
                        {fmtCurrencyNZD(
                          (() => {
                            const raw = Number(order?.shippingPrice ?? order?.shipping ?? 0);
                            let s = parseMoneyToDollars(raw);
                            const itemsVal = parseMoneyToDollars(order?.itemsPrice ?? order?.subtotal ?? order?.totalPrice ?? 0);
                            if (raw >= 100 && itemsVal < 1000) {
                              s = Number((raw / 100).toFixed(2));
                            }
                            return s;
                          })()
                        )}
                      </div>
                    </div>

                    {(parseMoneyToDollars(order?.taxPrice ?? order?.tax ?? 0) > 0) && (
                      <div className="order-totals-row-responsive">
                        <div className="order-totals-label-responsive">Tax</div>
                        <div className="order-totals-value-responsive">{fmtCurrencyNZD(parseMoneyToDollars(order?.taxPrice ?? order?.tax ?? 0))}</div>
                      </div>
                    )}

                    {(parseMoneyToDollars(order?.discountAmount ?? order?.discount ?? 0) > 0) && (
                      <div className="order-totals-row-responsive">
                        <div className="order-totals-label-responsive">Discount</div>
                        <div className="order-totals-value-responsive">-{fmtCurrencyNZD(parseMoneyToDollars(order?.discountAmount ?? order?.discount ?? 0))}</div>
                      </div>
                    )}

                    <div className="order-totals-row-responsive total">
                      <div className="order-totals-value-responsive">Total</div>
                      <div className="order-totals-total-responsive">{fmtCurrencyNZD(totalDollars)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-actions-responsive">
                <Link to="/account?tab=orders">
                  <button className="btn-primary-responsive">View Orders</button>
                </Link>
                <Link to="/">
                  <button className="btn-secondary-responsive">Continue Shopping</button>
                </Link>
              </div>
            </>
          ) : (
            <div className="error-container-responsive">
              <div className="error-icon-responsive">!</div>
              <h2>Order Information Missing</h2>
              <p style={{ color: "#6b7280" }}>We couldn't find order details. If you navigated here directly, open "My orders" to find your order.</p>
              <div style={{ marginTop: 20 }}>
                <Link to="/account?tab=orders">
                  <button className="btn-primary-responsive">View Your Orders</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}