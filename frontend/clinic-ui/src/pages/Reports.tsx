import { useEffect, useState } from "react";
import React from "react";
import { API_URL } from "../config/api";


export default function Reports() {
  const[reportData, setReportData] = React.useState<any>(null);
  const[loading, setLoading] = React.useState(true);
  const [timeRange, setTimeRange] = useState("this_month");
  const [auditData, setAuditData] = useState([]);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [activeReferrals, setActiveReferrals] = useState<any[]>([]);
  const [showPendingDuesModal, setShowPendingDuesModal] = useState(false);
  const [pendingDuesList, setPendingDuesList] = useState<any[]>([]);
  const [followUpsData, setFollowUpsData] = useState<any>({ tomorrow: 0, thisWeek: 0 });

  useEffect (() => {
    const fetchReportData = async () => {
      try{
        const response = await fetch(`${API_URL}/reports/summary`);
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActiveReferralsData = async () => {
      try {
        const response = await fetch(`${API_URL}/reports/active-referrals`);
        const data = await response.json();
        setActiveReferrals(data);
      } catch (error) {
        console.error("Error fetching active referrals:", error);
        setActiveReferrals([]);
      }
    };

    const fetchPendingDuesData = async () => {
      try {
        const response = await fetch(`${API_URL}/reports/pending-dues`);
        const data = await response.json();
        setPendingDuesList(data);
      } catch (error) {
        console.error("Error fetching pending dues:", error);
        setPendingDuesList([]);
      }
    };

    const fetchFollowUpsData = async () => {
      try {
        const response = await fetch(`${API_URL}/reports/upcoming-follow-ups`);
        const data = await response.json();
        setFollowUpsData(data);
      } catch (error) {
        console.error("Error fetching follow-ups:", error);
        setFollowUpsData({ tomorrow: 0, thisWeek: 0 });
      }
    };

    fetchReportData();
    fetchActiveReferralsData();
    fetchPendingDuesData();
    fetchFollowUpsData();
  }, []);

  useEffect(() => {
  const fetchAudit = async () => {
    try {
      const res = await fetch(`${API_URL}/reports/financial-audit?range=${timeRange}`);
      const data = await res.json();
      setAuditData(data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchAudit();
}, [timeRange]); // Re-fetches data whenever the dropdown changes

  const handleExportpdf=() => {
    alert("Exporting report as PDF...");
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header Section */}
        <h1 style={styles.title}>Reports Central</h1>
        <p style={styles.subtitle}>Generate and audit clinical and financial statements.</p>

        {/* Quick Stats Summary */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ color: "#64748B", fontSize: "12px", fontWeight: "700" }}>TOTAL REVENUE (MTD)</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#0F172A" }}>
              {loading ? "..." : `₹${reportData?.totalRevenue || 0}`}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ color: "#64748B", fontSize: "12px", fontWeight: "700" }}>PENDING BALANCES</div>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#EF4444" }}>
              {loading ? "..." : `₹${reportData?.pendingDues || 0}`}
            </div>
          </div>
        </div>

        <div style={styles.reportGrid}>
          
          {/* 1. FINANCIAL AUDIT REPORT */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.sectionTitle}>Financial Audit Log</h3>
              <select 
                style={styles.filterSelect}
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div style={styles.list}>
              {auditData && auditData.length > 0 ? (
                auditData.map((visit: any, index: number) => (
                  <div key={visit._id || index} style={styles.listItem}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{visit.patientId?.fullName || "Patient"}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>
                        {new Date(visit.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: "#0F172A" }}>
                      ₹{visit.fees?.netPayable || 0}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                  No records found for this period.
                </div>
              )}
            </div>
          </div>

          {/* 2. REFERRAL TRACKING */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.sectionTitle}>Active Referrals</h3>
              <button style={styles.downloadBtn} onClick={() => setShowReferralModal(true)}>View List</button>
            </div>
            <div style={styles.list}>
              {activeReferrals && activeReferrals.length > 0 ? (
                activeReferrals.slice(0, 2).map((referral: any, index: number) => (
                  <div key={referral._id || index} style={styles.listItem}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{referral.patientName}</div>
                      <div style={{ fontSize: "12px", color: "#64748B" }}>
                        {referral.specialty} • {referral.targetName}
                      </div>
                    </div>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          referral.urgency === "Urgent"
                            ? "#FEE2E2"
                            : referral.urgency === "Pending"
                            ? "#FEF08A"
                            : "#F1F5F9",
                        color:
                          referral.urgency === "Urgent"
                            ? "#DC2626"
                            : referral.urgency === "Pending"
                            ? "#CA8A04"
                            : "#475569",
                      }}
                    >
                      {referral.urgency}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                  No active referrals
                </div>
              )}
            </div>
          </div>

          {/* 3. OUTSTANDING BALANCES */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.sectionTitle}>Pending Dues</h3>
              <button style={styles.downloadBtn} onClick={() => setShowPendingDuesModal(true)}>View All</button>
            </div>
            <div style={styles.list}>
              {pendingDuesList && pendingDuesList.length > 0 ? (
                pendingDuesList.slice(0, 2).map((due: any, index: number) => (
                  <div key={due.patientId || index} style={styles.listItem}>
                    <span>{due.patientName}</span>
                    <span style={{ fontWeight: 700, color: "#DC2626" }}>₹{due.totalDue}</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                  No pending dues
                </div>
              )}
            </div>
          </div>

          {/* 4. FOLLOW-UP COMPLIANCE */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.sectionTitle}>Upcoming Follow-ups</h3>
              <button style={styles.downloadBtn}>Schedule</button>
            </div>
            <div style={styles.list}>
              <div style={styles.listItem}>
                <span>Scheduled for Tomorrow</span>
                <span style={{ fontWeight: 700 }}>{followUpsData.tomorrow} Patient{followUpsData.tomorrow !== 1 ? 's' : ''}</span>
              </div>
              <div style={styles.listItem}>
                <span>Scheduled for This Week</span>
                <span style={{ fontWeight: 700 }}>{followUpsData.thisWeek} Patient{followUpsData.thisWeek !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <div style={styles.modalOverlay} onClick={() => setShowReferralModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Active Referrals</h2>
              <button 
                style={styles.closeBtn} 
                onClick={() => setShowReferralModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              {activeReferrals.length > 0 ? (
                activeReferrals.map((referral: any) => (
                  <div key={referral._id} style={styles.referralItem}>
                    <div style={styles.referralContent}>
                      <div style={styles.referralName}>{referral.patientName}</div>
                      <div style={styles.referralSpecialty}>
                        {referral.specialty} • {referral.targetName}
                      </div>
                      <div style={styles.referralDate}>
                        Referred on: {referral.referredDate}
                      </div>
                    </div>
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          referral.urgency === "Urgent"
                            ? "#FEE2E2"
                            : referral.urgency === "Pending"
                            ? "#FEF08A"
                            : "#F1F5F9",
                        color:
                          referral.urgency === "Urgent"
                            ? "#DC2626"
                            : referral.urgency === "Pending"
                            ? "#CA8A04"
                            : "#475569",
                      }}
                    >
                      {referral.urgency}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No active referrals
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={styles.closeModalBtn}
                onClick={() => setShowReferralModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Dues Modal */}
      {showPendingDuesModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPendingDuesModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Pending Dues</h2>
              <button 
                style={styles.closeBtn} 
                onClick={() => setShowPendingDuesModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              {pendingDuesList.length > 0 ? (
                pendingDuesList.map((due: any) => (
                  <div key={due.patientId} style={styles.duesItem}>
                    <div>
                      <div style={styles.duesPatientName}>{due.patientName}</div>
                      <div style={styles.duesAmount}>Outstanding Amount</div>
                    </div>
                    <span style={{ fontWeight: 700, color: "#DC2626", fontSize: "18px" }}>
                      ₹{due.totalDue}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No pending dues
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button 
                style={styles.closeModalBtn}
                onClick={() => setShowPendingDuesModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F1F5F9", 
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
    textAlign: "left",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0F172A",
    margin: 0,
  },
  subtitle: {
    color: "#64748B",
    marginTop: "8px",
    fontSize: "15px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #E2E8F0",
  },
  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #F1F5F9",
    paddingBottom: "12px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  actionBtn: {
    background: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  downloadBtn: {
    background: "#0F172A",
    color: "#FFFFFF",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  tableRow: {
    borderBottom: "1px solid #F1F5F9",
  },
  tableCell: {
    padding: "12px 0",
    color: "#334155",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #F8FAFC",
    fontSize: "14px",
    color: "#334155",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  filterSelect: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    fontSize: "13px",
    color: "#0F172A",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  } as React.CSSProperties,
  modalContent: {
    background: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    border: "1px solid #E2E8F0",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  } as React.CSSProperties,
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #E2E8F0",
  } as React.CSSProperties,
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "28px",
    color: "#64748B",
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  modalBody: {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
  } as React.CSSProperties,
  referralItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px",
    marginBottom: "12px",
    backgroundColor: "#F8FAFC",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  referralContent: {
    flex: 1,
  } as React.CSSProperties,
  referralName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "4px",
  },
  referralSpecialty: {
    fontSize: "13px",
    color: "#64748B",
    marginBottom: "6px",
  },
  referralDate: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  modalFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #E2E8F0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  } as React.CSSProperties,
  closeModalBtn: {
    background: "#E2E8F0",
    color: "#0F172A",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  duesItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    marginBottom: "12px",
    backgroundColor: "#FEF2F2",
    borderRadius: "12px",
    border: "1px solid #FECACA",
    transition: "all 0.2s ease",
  } as React.CSSProperties,
  duesPatientName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "4px",
  },
  duesAmount: {
    fontSize: "12px",
    color: "#64748B",
  },
};