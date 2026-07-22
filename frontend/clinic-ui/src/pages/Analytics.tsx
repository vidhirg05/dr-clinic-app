import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { API_URL } from "../config/api";

export default function Analytics() {
  const [kpiData, setKpiData] = useState<any>(null);
  const [revenueTrends, setRevenueTrends] = useState<any[]>([]);
  const [specialtyData, setSpecialtyData] = useState<any[]>([]);
  const [peakHours, setPeakHours] = useState<any[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const [kpiRes, revenueRes, specialtyRes, hoursRes, weeklyRes] = await Promise.all([
          fetch(`${API_URL}/analytics/kpi-summary`),
          fetch(`${API_URL}/analytics/revenue-trends`),
          fetch(`${API_URL}/analytics/specialty-breakdown`),
          fetch(`${API_URL}/analytics/peak-hours`),
          fetch(`${API_URL}/analytics/weekly-trends`),
        ]);

        const kpiDataJson = await kpiRes.json();
        const revenueTrendsJson = await revenueRes.json();
        const specialtyDataJson = await specialtyRes.json();
        const peakHoursJson = await hoursRes.json();
        const weeklyTrendsJson = await weeklyRes.json();

        setKpiData(kpiDataJson);
        setRevenueTrends(revenueTrendsJson);
        setSpecialtyData(specialtyDataJson);
        setPeakHours(peakHoursJson);
        setWeeklyTrends(weeklyTrendsJson);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const getBarWidth = (value: number, maxValue: number) => {
    if (!maxValue) return "8%";
    return `${Math.max(10, (value / maxValue) * 100)}%`;
  };

  const maxRevenue = Math.max(...revenueTrends.map((item: any) => Number(item.revenue || 0)), 1);
  const maxVisitValue = Math.max(
    ...[...peakHours, ...weeklyTrends].map((item: any) => Number(item.visits || 0)),
    1
  );
  const maxSpecialtyRevenue = Math.max(
    ...specialtyData.map((item: any) => Number(item.revenue || 0)),
    1
  );

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Analytics & Insights</h1>
          <p style={styles.subtitle}>Loading clinic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Analytics & Insights</h1>
        <p style={styles.subtitle}>Clinic performance metrics and detailed insights.</p>

        {/* KPI Cards */}
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Active Patient Growth</div>
            <div style={styles.kpiValue}>{kpiData?.activePatientGrowth?.current || 0}</div>
            <div style={styles.kpiSubtext}>
              This Month {kpiData?.activePatientGrowth?.growthPercentage > 0 ? "↑" : "↓"}{" "}
              {Math.abs(kpiData?.activePatientGrowth?.growthPercentage || 0)}% vs last month
            </div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>Avg Revenue Per Visit</div>
            <div style={styles.kpiValue}>₹{kpiData?.averageRevenuePerVisit || 0}</div>
            <div style={styles.kpiSubtext}>Based on total visits</div>
          </div>

          <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>No-Show Rate</div>
            <div style={{ ...styles.kpiValue, color: "#DC2626" }}>
              {kpiData?.noShowRate || 0}%
            </div>
            <div style={styles.kpiSubtext}>Missed appointments</div>
          </div>
        </div>

        {/* Simple Summary Grid */}
        <div style={styles.chartsGrid}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Revenue Trends (Last 6 Months)</h3>
            <div style={styles.simpleList}>
              {revenueTrends.map((item: any) => (
                <div key={item.month} style={styles.simpleRow}>
                  <div style={styles.simpleLabelRow}>
                    <span>{item.month}</span>
                    <span>₹{item.revenue}</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: getBarWidth(Number(item.revenue || 0), maxRevenue),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Specialty Breakdown</h3>
            <div style={styles.simpleList}>
              {specialtyData.map((item: any) => (
                <div key={item.name} style={styles.simpleRow}>
                  <div style={styles.simpleLabelRow}>
                    <span>{item.name}</span>
                    <span>₹{item.revenue}</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: getBarWidth(Number(item.revenue || 0), maxSpecialtyRevenue),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Peak Visit Hours</h3>
            <div style={styles.simpleList}>
              {peakHours.map((item: any) => (
                <div key={item.hour} style={styles.simpleRow}>
                  <div style={styles.simpleLabelRow}>
                    <span>{item.hour}</span>
                    <span>{item.visits} visits</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: getBarWidth(Number(item.visits || 0), maxVisitValue),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Weekly Distribution</h3>
            <div style={styles.simpleList}>
              {weeklyTrends.map((item: any) => (
                <div key={item.day} style={styles.simpleRow}>
                  <div style={styles.simpleLabelRow}>
                    <span>{item.day}</span>
                    <span>{item.visits} visits</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: getBarWidth(Number(item.visits || 0), maxVisitValue),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Specialty Performance</h3>
            <div style={styles.table}>
              {specialtyData.map((specialty: any, index: number) => (
                <div key={index} style={styles.tableRow}>
                  <div style={styles.tableCell}>
                    <div style={styles.cellTitle}>{specialty.name}</div>
                    <div style={styles.cellSubtext}>{specialty.volume} visits</div>
                  </div>
                  <div style={{ ...styles.tableCell, fontWeight: 700, color: "#0F172A" }}>
                    ₹{specialty.revenue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F1F5F9",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0F172A",
    margin: 0,
    marginBottom: "8px",
  },
  subtitle: {
    color: "#64748B",
    fontSize: "15px",
    marginBottom: "32px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  kpiCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  kpiLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  },
  kpiValue: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "8px",
  },
  kpiSubtext: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "24px",
  },
  chartCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02)",
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
    marginBottom: "20px",
  },
  simpleList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  simpleRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  simpleLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: 600,
    color: "#0F172A",
  },
  barTrack: {
    width: "100%",
    height: "8px",
    backgroundColor: "#E2E8F0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #0F172A 0%, #1D4ED8 100%)",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  } as CSSProperties,
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#F8FAFC",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
  },
  tableCell: {
    flex: 1,
  },
  cellTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: "4px",
  },
  cellSubtext: {
    fontSize: "12px",
    color: "#64748B",
  },
};
