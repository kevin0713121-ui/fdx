import { useMemo, useState } from "react";
import {
  Barcode,
  Bell,
  CaretDown,
  CaretLeft,
  CaretRight,
  CheckCircle,
  ClipboardText,
  Crosshair,
  Cube,
  FileText,
  MagnifyingGlass,
  Package,
  PencilSimple,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";

const fedexLogoUrl = `${import.meta.env.BASE_URL}assets/fedex-logo.png`;

const duplicatedPart = {
  htsNumber: "6206403050",
  partDescription: "PVC filter",
  destinationCountry: "US",
};

const lineItemColumns = [
  { key: "destinationCountry", label: "Destination Country", width: "11%" },
  { key: "region", label: "Region", width: "8%" },
  { key: "htsNumber", label: "HTS Number", width: "12%" },
  { key: "partDescription", label: "Part Description", width: "17%" },
  { key: "customerShippingDesc", label: "Customer Shipping Desc", width: "20%" },
  { key: "shippingCompanyName", label: "Shipping Company Name", width: "19%" },
  { key: "status", label: "Status", width: "10%" },
];

const commonCommodityFields = [
  { key: "customerExpDescCn", label: "Customer Exp Desc(CN)", value: "-" },
  { key: "preferredDescCn", label: "Preferred Desc(CN)", value: "-" },
  { key: "exportHsCode", label: "Export HS Code", value: "-" },
];

const pendingLineItems = [
  {
    id: "us-item",
    destinationCountry: "US",
    region: "US",
    htsNumber: "8421990090",
    partDescription: "PVC water filter cartridge",
    customerShippingDesc: "Replacement filter cartridge",
    shippingCompanyName: "Blue Harbor Trading",
    status: "Pending",
  },
  {
    id: "eu-item",
    destinationCountry: "DE",
    region: "EU",
    htsNumber: "6110303059",
    partDescription: "Ladies knit jacket",
    customerShippingDesc: "Women's cotton knit jacket",
    shippingCompanyName: "Rhine Apparel GmbH",
    status: "Pending",
  },
];

const completedLineItems = [
  {
    id: "completed-active-item",
    destinationCountry: "JP",
    region: "US",
    htsNumber: "3926909985",
    partDescription: "Silicone cable organizer",
    customerShippingDesc: "Reusable silicone cable clip",
    shippingCompanyName: "Tokyo Retail Imports",
    status: "Active",
  },
  {
    id: "completed-reject-item",
    destinationCountry: "CA",
    region: "US",
    htsNumber: "9503000073",
    partDescription: "Wooden stacking toy",
    customerShippingDesc: "Wooden stacking rings for children",
    shippingCompanyName: "North Star Imports",
    status: "Reject",
  },
];

const lineItemsByTab = {
  Pending: pendingLineItems,
  Completed: completedLineItems,
};

const lineItemDetails = {
  "us-item": {
    mid: {
      code: "CNGUAFIL101GUA",
      manufacturerName: "Guangzhou ClearFlow Products Co., Ltd.",
      countryOfOrigin: "CN",
      city: "Guangzhou",
      postalCode: "510440",
      address: "No. 88 Helong Road, Baiyun District, Guangzhou, Guangdong, China",
    },
    cpsc: {
      disclaimCode: "A",
      intendedUseCode: "060.010",
      intendedUseDescription: "Household water filtration",
      filingType: "DIS",
      registryProdId: "CPSC-REG-2026-01482",
      registryVersId: "V2",
      registryCertId: "CF-842199-US-02",
      isChildrensProduct: "No",
    },
    shipment: { awb: "202609151357", originCountry: "CN", destinationCountry: "US", pickupLoc: "CAN" },
  },
  "eu-item": {
    pid: {
      merchantProductId: "TGH-JU-343564647",
      nonStdManufacturerProductId: "QW234344454",
      stdManufacturerProductId: "-",
    },
    shipment: { awb: "202609151846", originCountry: "CN", destinationCountry: "DE", pickupLoc: "NGB" },
  },
  "completed-active-item": {
    mid: {
      code: "VNHOCTEC310SGN",
      manufacturerName: "Saigon Tech Accessories JSC",
      countryOfOrigin: "VN",
      city: "Ho Chi Minh City",
      postalCode: "700000",
      address: "42 Nguyen Van Linh Boulevard, District 7, Ho Chi Minh City, Vietnam",
    },
    cpsc: {
      disclaimCode: "E",
      intendedUseCode: "040.024",
      intendedUseDescription: "General consumer electronic accessory",
      filingType: "EXM",
      registryProdId: "CPSC-REG-2026-03109",
      registryVersId: "V3",
      registryCertId: "SG-392690-JP-11",
      isChildrensProduct: "No",
    },
    shipment: { awb: "202609209845", originCountry: "VN", destinationCountry: "JP", pickupLoc: "SGN" },
  },
  "completed-reject-item": {
    mid: {
      code: "CNSZHOMY415SZX",
      manufacturerName: "Shenzhen Bright Kids Products Co., Ltd.",
      countryOfOrigin: "CN",
      city: "Shenzhen",
      postalCode: "518000",
      address: "16 Tongle Industrial Road, Longgang District, Shenzhen, Guangdong, China",
    },
    cpsc: {
      disclaimCode: "-",
      intendedUseCode: "091.003",
      intendedUseDescription: "Children's educational toy",
      filingType: "GCC",
      registryProdId: "CPSC-REG-2026-04763",
      registryVersId: "V1",
      registryCertId: "Missing",
      isChildrensProduct: "Yes",
    },
    shipment: { awb: "202609228814", originCountry: "CN", destinationCountry: "CA", pickupLoc: "SZX" },
  },
};

function createInformationSections(lineItemId) {
  const detail = lineItemDetails[lineItemId] ?? lineItemDetails["us-item"];
  const productIdentitySections = detail.pid ? [
    {
      label: "PID",
      columns: 3,
      fields: [
        { label: "Merchant Product ID", value: detail.pid.merchantProductId },
        { label: "Non-Std Manufacturer Product ID", value: detail.pid.nonStdManufacturerProductId },
        { label: "Std Manufacturer Product ID", value: detail.pid.stdManufacturerProductId },
      ],
    },
  ] : [
    {
      label: "MID",
      columns: 4,
      fields: [
        { label: "MID Code", value: detail.mid.code },
        { label: "Manufacturer Name", value: detail.mid.manufacturerName },
        { label: "Country Of Origin", value: detail.mid.countryOfOrigin },
        { label: "City", value: detail.mid.city },
        { label: "Postal Code", value: detail.mid.postalCode },
        { label: "Manufacturer Address", value: detail.mid.address, span: 3 },
      ],
    },
    {
      label: "CPSC",
      link: "CPSC Dataset",
      columns: 4,
      fields: [
        { label: "Disclaim Code", value: detail.cpsc.disclaimCode },
        { label: "Intended Use Code", value: detail.cpsc.intendedUseCode },
        { label: "Intended Use Description", value: detail.cpsc.intendedUseDescription },
        { label: "Filing Type", value: detail.cpsc.filingType },
        { label: "Registry Prod ID", value: detail.cpsc.registryProdId },
        { label: "Registry Vers ID", value: detail.cpsc.registryVersId },
        { label: "Registry Cert ID", value: detail.cpsc.registryCertId },
        { label: "Is Childrens Product", value: detail.cpsc.isChildrensProduct },
      ],
    },
  ];

  return [
    ...productIdentitySections,
    {
      label: "Shipment",
      columns: 4,
      fields: [
        { label: "AWB#", value: detail.shipment.awb },
        { label: "Origin Country", value: detail.shipment.originCountry },
        { label: "Destination Country", value: detail.shipment.destinationCountry },
        { label: "Pickup Loc", value: detail.shipment.pickupLoc },
      ],
    },
  ];
}

const navigation = [
  { label: "SHIPMENT", icon: MagnifyingGlass },
  { label: "INCOMPLETE DATA", icon: Cube },
  { label: "MY TASK", icon: ClipboardText },
  { label: "PRODUCT CATALOG", icon: FileText },
  { label: "BARCODE PRINT", icon: Barcode },
  { label: "VCC", icon: Crosshair, grouped: true },
  { label: "VCC MASTER DATA", icon: Package, grouped: true },
  { label: "MASS MARKET", icon: Cube, grouped: true },
];

function Header({ menuOpen, onMenuToggle }) {
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <img className="brand-logo" src={fedexLogoUrl} alt="FedEx" />
          <nav className="primary-nav" aria-label="Primary">
            <button className="top-link active" type="button">US</button>
            <button className="top-link" type="button">File Center</button>
          </nav>
          <div className="account-tools">
            <button className="compact-menu" type="button">CN <CaretDown /></button>
            <button className="compact-menu" type="button">简体中文 <CaretDown /></button>
            <button className="notification-button" aria-label="Notifications" type="button">
              <Bell weight="regular" />
              <span>3</span>
            </button>
            <div className="account-wrap">
              <button className="account-button" onClick={onMenuToggle} type="button">
                <span>shenglin.xie01</span>
                <span className="avatar"><img src={fedexLogoUrl} alt="" /></span>
                <CaretDown />
              </button>
              {menuOpen && (
                <div className="account-popover">
                  <strong>shenglin.xie01</strong>
                  <span>FedEx US · Product Catalog</span>
                  <button type="button">Account settings</button>
                </div>
              )}
            </div>
            <button className="timezone-button" type="button">Time Zone: (GMT+08:00) Beijing (CST) <CaretDown /></button>
          </div>
        </div>
      </header>
      <div className="subbar">
        <strong>FedEx US</strong>
        <span className="subbar-divider" />
        <span>Product Catalog</span>
      </div>
      <div className="prototype-banner" role="note" aria-label="Internal prototype notice">
        <ShieldCheck weight="fill" />
        <strong>Internal UI Prototype</strong>
        <span>Design review only · No login or data collection</span>
        <span className="prototype-environment">NON-PRODUCTION</span>
      </div>
    </>
  );
}

function Sidebar({ collapsed, active, onSelect, onToggle }) {
  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-list">
        {navigation.map(({ label, icon: Icon, grouped }) => (
          <button
            className={`nav-item ${active === label ? "selected" : ""}`}
            key={label}
            onClick={() => onSelect(label)}
            title={collapsed ? label : undefined}
            type="button"
          >
            <Icon className="nav-icon" weight="regular" />
            <span>{label}</span>
            {grouped && <CaretDown className="nav-caret" weight="bold" />}
          </button>
        ))}
      </div>
      <button className="collapse-button" onClick={onToggle} aria-label="Toggle sidebar" type="button">
        {collapsed ? <CaretRight weight="bold" /> : <><CaretLeft weight="bold" /><CaretLeft weight="bold" /></>}
      </button>
    </aside>
  );
}

function getFieldRowIndexes(fields, columns) {
  let currentColumn = 0;
  let currentRow = 0;

  return fields.map((field) => {
    const span = Math.min(field.span || 1, columns);

    if (currentColumn > 0 && currentColumn + span > columns) {
      currentRow += 1;
      currentColumn = 0;
    }

    const rowIndex = currentRow;
    currentColumn += span;

    if (currentColumn >= columns) {
      currentRow += 1;
      currentColumn = 0;
    }

    return rowIndex;
  });
}

function Field({ field, editing, isLastRow, onEditValue }) {
  const span = field.span || 1;
  return (
    <div className={`data-field${isLastRow ? " is-last-row" : ""}`} style={{ gridColumn: `span ${span}` }}>
      <div className="field-content">
        <span className="field-label">{field.label} :</span>
        {editing ? (
          <input
            value={field.value}
            aria-label={field.label}
            onChange={(event) => onEditValue(event.target.value)}
          />
        ) : (
          <strong>{field.value}</strong>
        )}
        {field.tags?.map((tag) => <span className="code-tag" key={tag}>{tag}</span>)}
      </div>
    </div>
  );
}

function InformationSection({ section, editing, values, valueScope, onFieldChange }) {
  const fieldRowIndexes = getFieldRowIndexes(section.fields, section.columns);
  const lastRowIndex = Math.max(...fieldRowIndexes);

  return (
    <section className={`information-section linked-detail-section section-${section.label.toLowerCase()}`} data-line-item-id={valueScope}>
      <div className="section-title-row">
        <h2>{section.label}</h2>
        {section.link && <button aria-disabled="true" className="dataset-link temporarily-inert" type="button">{section.link}</button>}
      </div>
      <div className="data-grid" style={{ "--columns": section.columns }}>
        {section.fields.map((field, fieldIndex) => {
          const fieldKey = `${valueScope}-${section.label}-${field.label}`;
          const currentField = { ...field, value: values[fieldKey] ?? field.value };
          return (
            <Field
              key={fieldKey}
              field={currentField}
              editing={editing}
              isLastRow={fieldRowIndexes[fieldIndex] === lastRowIndex}
              onEditValue={(nextValue) => onFieldChange(fieldKey, nextValue)}
            />
          );
        })}
      </div>
    </section>
  );
}

function LineItemCommoditySection({ activeTab, selectedRowId, editing, values, onFieldChange, onRowSelect, onTabChange }) {
  const rows = lineItemsByTab[activeTab];
  return (
    <section className="information-section line-item-section" aria-labelledby="line-item-title">
      <div className="section-title-row">
        <h2 id="line-item-title">Line-Item Commodity</h2>
      </div>
      <div className="line-item-tabs" role="tablist" aria-label="Line-item status">
        {["Pending", "Completed"].map((tab) => (
          <button
            aria-controls={`line-item-${tab.toLowerCase()}-panel`}
            aria-selected={activeTab === tab}
            className={`line-item-tab${activeTab === tab ? " active" : ""}`}
            id={`line-item-${tab.toLowerCase()}-tab`}
            key={tab}
            onClick={() => onTabChange(tab)}
            role="tab"
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`line-item-${activeTab.toLowerCase()}-tab`}
        className="line-item-tab-panel"
        id={`line-item-${activeTab.toLowerCase()}-panel`}
        role="tabpanel"
      >
        <table className="line-item-table">
          <colgroup>
            <col style={{ width: "3%" }} />
            {lineItemColumns.map((column) => <col key={column.key} style={{ width: column.width }} />)}
          </colgroup>
          <thead>
            <tr>
              <th aria-label="Select Row" className="line-item-select-column" scope="col" />
              {lineItemColumns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row) => (
              <tr
                aria-selected={selectedRowId === row.id}
                className={`line-item-data-row${selectedRowId === row.id ? " selected" : ""}`}
                key={row.id}
                onClick={() => onRowSelect(row.id)}
              >
                <td className="line-item-select-column">
                  <input
                    aria-label={`Select ${row.region} line item`}
                    checked={selectedRowId === row.id}
                    className="line-item-radio"
                    name="line-item-selection"
                    onChange={() => onRowSelect(row.id)}
                    onClick={(event) => event.stopPropagation()}
                    type="radio"
                  />
                </td>
                {lineItemColumns.map((column) => {
                  const fieldKey = `Line-Item Commodity-${row.id}-${column.key}`;
                  const currentValue = values[fieldKey] ?? row[column.key];
                  const isStatus = column.key === "status";
                  return (
                    <td key={column.key}>
                      {editing && !isStatus ? (
                        <input
                          aria-label={column.label}
                          onChange={(event) => onFieldChange(fieldKey, event.target.value)}
                          value={currentValue}
                        />
                      ) : isStatus ? (
                        <span className={`line-item-status ${currentValue.toLowerCase()}`}>{currentValue}</span>
                      ) : (
                        <span className="line-item-cell-value" title={currentValue}>{currentValue}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )) : (
              <tr className="line-item-empty-row">
                <td colSpan={lineItemColumns.length + 1}>No completed line items</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="commodity-common-panel" aria-label="Common commodity information">
        <div className="commodity-common-heading">
          <strong>Common Commodity Information</strong>
          <span className="commodity-common-scope"><i aria-hidden="true" /> Applies to all destinations</span>
        </div>
        <div className="data-grid commodity-common-grid" style={{ "--columns": 3 }}>
          {commonCommodityFields.map((field) => {
            const fieldKey = `Line-Item Commodity-Common-${field.key}`;
            const currentField = { ...field, value: values[fieldKey] ?? field.value };
            return (
              <Field
                key={fieldKey}
                field={currentField}
                editing={editing}
                isLastRow
                onEditValue={(nextValue) => onFieldChange(fieldKey, nextValue)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DuplicatePanel({ record }) {
  return (
    <section className="duplicate-panel" aria-labelledby="duplicate-title">
      <div className="duplicate-title-row">
        <h2 id="duplicate-title">Duplicated Part Number</h2>
        <span className={record ? "duplicate-count" : "duplicate-count empty"}>{record ? 1 : 0}</span>
      </div>
      {record ? (
        <div className="duplicate-table" role="table" aria-label="Duplicated part numbers">
          <div className="duplicate-row duplicate-head" role="row">
            <span role="columnheader">Destination Country</span>
            <span role="columnheader">HTS Number</span>
            <span role="columnheader">Part Description</span>
            <span role="columnheader">Action</span>
          </div>
          <div className="duplicate-row duplicate-data" role="row">
            <span role="cell">{record.destinationCountry}</span>
            <span role="cell">{record.htsNumber}</span>
            <span className="duplicate-truncate" role="cell" title={record.partDescription}>{record.partDescription}</span>
            <span className="duplicate-actions" role="cell">
              <button aria-disabled="true" className="temporarily-inert" type="button">View</button>
              <span aria-hidden="true">|</span>
              <button aria-disabled="true" className="temporarily-inert" type="button">Delete</button>
            </span>
          </div>
        </div>
      ) : (
        <div className="duplicate-empty">No duplicated part numbers</div>
      )}
    </section>
  );
}

function DuplicateDetailsModal({ record, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="duplicate-details-modal" role="dialog" aria-modal="true" aria-labelledby="duplicate-details-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="duplicate-modal-heading">
          <div>
            <span className="duplicate-modal-kicker">Duplicate Record</span>
            <h2 id="duplicate-details-title">Duplicate Record Details</h2>
          </div>
          <button aria-label="Close duplicate details" onClick={onClose} type="button"><X weight="bold" /></button>
        </div>
        <dl className="duplicate-detail-grid">
          <div><dt>Destination Country</dt><dd>{record.destinationCountry}</dd></div>
          <div><dt>HTS Number</dt><dd>{record.htsNumber}</dd></div>
          <div><dt>Part Description</dt><dd>{record.partDescription}</dd></div>
        </dl>
        <div className="modal-actions">
          <button className="button primary" onClick={onClose} type="button">CLOSE</button>
        </div>
      </section>
    </div>
  );
}

function DecisionModal({ action, record, onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  const isReject = action.startsWith("Reject");

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className={`decision-modal record-confirmation-modal ${isReject ? "rejection-modal" : "approval-modal"}`} role="dialog" aria-modal="true" aria-labelledby="decision-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="record-confirmation-heading">
          <h2 id="decision-title">Confirm {isReject ? "Rejection" : "Approval"}</h2>
          <button aria-label={`Close ${isReject ? "rejection" : "approval"} confirmation`} onClick={onCancel} type="button"><X weight="regular" /></button>
        </div>
        <div className="record-confirmation-body">
          <p className="record-confirmation-message">
            You’re about to {isReject ? "reject" : "approve"} the selected product catalog record — Destination Country: <strong>{record.destinationCountry}</strong>, HTS Number: <strong>{record.htsNumber}</strong>, Part Description: <strong>“{record.partDescription}”</strong>. {isReject ? "Please add a clear comment explaining what needs to be corrected." : "Please confirm that you have reviewed this information and want to approve this record."}
          </p>
          {isReject && (
            <textarea
              aria-label="Rejection comments"
              autoFocus
              onChange={(event) => setReason(event.target.value)}
              placeholder="Comments required for rejection"
              value={reason}
            />
          )}
          <div className="modal-actions record-confirmation-actions">
            <button className="button record-confirmation-cancel" onClick={onCancel} type="button">CANCEL</button>
            <button
              autoFocus={!isReject}
              className={`button record-confirmation-primary ${isReject ? "rejection-confirm" : "approval-confirm"}`}
              disabled={isReject && !reason.trim()}
              onClick={() => onConfirm(reason)}
              type="button"
            >
              {isReject ? "REJECT" : "APPROVE"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({});
  const [accountOpen, setAccountOpen] = useState(false);
  const [decision, setDecision] = useState(null);
  const [status, setStatus] = useState("Pending Approval");
  const [toast, setToast] = useState("");
  const [duplicateRecord] = useState(duplicatedPart);
  const [activeLineItemTab, setActiveLineItemTab] = useState("Pending");
  const [selectedLineItemId, setSelectedLineItemId] = useState(pendingLineItems[0].id);

  const statusClass = useMemo(() => status.toLowerCase().replaceAll(" ", "-"), [status]);
  const informationSections = useMemo(() => createInformationSections(selectedLineItemId), [selectedLineItemId]);
  const selectedLineItem = useMemo(
    () => [...pendingLineItems, ...completedLineItems].find((item) => item.id === selectedLineItemId) ?? pendingLineItems[0],
    [selectedLineItemId],
  );

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function confirmDecision() {
    const nextStatus = decision.startsWith("Reject") ? "Rejected" : "Approved";
    setStatus(nextStatus);
    setDecision(null);
    showToast(`${nextStatus}. The request has been updated.`);
  }

  function selectLineItemTab(tab) {
    setActiveLineItemTab(tab);
    setSelectedLineItemId(lineItemsByTab[tab][0].id);
  }

  return (
    <div className="app-shell">
      <Header menuOpen={accountOpen} onMenuToggle={() => setAccountOpen((value) => !value)} />
      <div className={collapsed ? "workspace sidebar-is-collapsed" : "workspace"}>
        <Sidebar collapsed={collapsed} active={activeNav} onSelect={setActiveNav} onToggle={() => setCollapsed((value) => !value)} />
        <main className={`main-area${activeLineItemTab === "Completed" ? " without-decision-bar" : ""}`}>
          <div className="page-heading">
            <button className="back-button" aria-label="Back" type="button"><CaretLeft weight="bold" /></button>
            <span>Product Catalog</span>
          </div>

          <div className="content-scroll">
            <section className="request-banner">
              <div className="request-summary">
                <div className="request-heading-row">
                  <h1>Approve Product Catalog Request</h1>
                  <button aria-disabled="true" className="edit-button temporarily-inert" type="button">
                    <PencilSimple weight="bold" /> Edit
                  </button>
                </div>
                <div className="request-meta">
                  <span className={`status-pill request-meta-status ${statusClass}`}><CheckCircle weight="regular" /> {status}</span>
                  <span className="request-meta-part"><small>Part Number :</small> <strong>sz2306169631330732</strong></span>
                  <span className="request-meta-shipper"><small>Shipper Account :</small> <strong>77574967</strong></span>
                  <span className="request-meta-requester"><small>Request By :</small> <strong>shenglin.xie01</strong></span>
                  <span className="request-meta-time"><small>Request Time :</small> <strong>2026-09-24 15:33:20</strong></span>
                </div>
              </div>
              <DuplicatePanel record={duplicateRecord} />
            </section>

            <LineItemCommoditySection
              activeTab={activeLineItemTab}
              selectedRowId={selectedLineItemId}
              editing={editing}
              values={values}
              onFieldChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))}
              onRowSelect={setSelectedLineItemId}
              onTabChange={selectLineItemTab}
            />
            {informationSections.map((section) => (
              <InformationSection
                key={`${selectedLineItemId}-${section.label}`}
                section={section}
                editing={editing}
                values={values}
                valueScope={selectedLineItemId}
                onFieldChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))}
              />
            ))}
            <div className="content-spacer" />
          </div>

          {activeLineItemTab === "Pending" && (
            <footer className="decision-bar">
              <button className="decision-button outline" onClick={() => setDecision("Reject")} type="button">REJECT</button>
              <button className="decision-button outline" onClick={() => setDecision("Reject and move next")} type="button">REJECT AND MOVE NEXT</button>
              <button className="decision-button filled" onClick={() => setDecision("Approve")} type="button">APPROVE</button>
              <button className="decision-button filled" onClick={() => setDecision("Approve and move next")} type="button">APPROVE AND MOVE NEXT</button>
            </footer>
          )}
        </main>
      </div>

      {decision && <DecisionModal action={decision} record={selectedLineItem} onCancel={() => setDecision(null)} onConfirm={confirmDecision} />}
      {toast && <div className="toast" role="status"><CheckCircle weight="fill" /> {toast}</div>}
    </div>
  );
}

export function App() {
  return <AppContent />;
}
