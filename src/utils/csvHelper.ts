import { BatchRealtorItem, RealtorProfile } from '../types';

/**
 * Robust CSV parser that handles quotes, commas, semicolons, or pipe separators
 */
export const parseCsvRows = (text: string): string[][] => {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  // Normalize line breaks
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const nextChar = normalized[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === ',' || char === '\t' || char === ';') && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(cell.trim());
      if (row.some(c => c.length > 0)) {
        lines.push(row);
      }
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  // Push trailing cell/row
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some(c => c.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
};

/**
 * Parses raw CSV content into structured BatchRealtorItem objects
 */
export const parseRealtorCsv = (
  csvContent: string,
  urlGenerator: (profile: Partial<RealtorProfile>) => string
): BatchRealtorItem[] => {
  const rows = parseCsvRows(csvContent);
  if (rows.length === 0) return [];

  // Check if first row is a header row
  const firstRow = rows[0].map(h => h.toLowerCase().trim());
  const hasHeader = firstRow.some(h => 
    h.includes('name') || h.includes('realtor') || h.includes('city') || h.includes('phone') || h.includes('broker')
  );

  let nameIdx = 0;
  let agentIdx = 1;
  let addressIdx = 2;
  let cityIdx = 3;
  let phoneIdx = 4;
  let emailIdx = 5;
  let waIdx = -1;
  let kwIdx = -1;
  let salesIdx = -1;

  let dataRows = rows;

  if (hasHeader) {
    nameIdx = firstRow.findIndex(h => h.includes('name') || h.includes('brokerage') || h.includes('company') || h.includes('business'));
    agentIdx = firstRow.findIndex(h => h.includes('agent') || h.includes('broker') || h.includes('owner') || h.includes('principal'));
    addressIdx = firstRow.findIndex(h => h.includes('address') || h.includes('street') || h.includes('addr') || h.includes('location'));
    cityIdx = firstRow.findIndex(h => h.includes('city') || h.includes('market') || h.includes('town') || h.includes('state'));
    phoneIdx = firstRow.findIndex(h => h.includes('phone') || h.includes('tel') || h.includes('mobile') || h.includes('contact'));
    emailIdx = firstRow.findIndex(h => h.includes('email') || h.includes('mail'));
    waIdx = firstRow.findIndex(h => h.includes('whatsapp') || h.includes('wa'));
    kwIdx = firstRow.findIndex(h => h.includes('keyword') || h.includes('kw') || h.includes('seo'));
    salesIdx = firstRow.findIndex(h => h.includes('volume') || h.includes('sales'));

    dataRows = rows.slice(1);
  }

  // Fallback indices if not detected
  if (nameIdx === -1) nameIdx = 0;
  if (agentIdx === -1) agentIdx = 1;
  if (addressIdx === -1) addressIdx = 2;
  if (cityIdx === -1) cityIdx = 3;
  if (phoneIdx === -1) phoneIdx = 4;
  if (emailIdx === -1) emailIdx = 5;

  const items: BatchRealtorItem[] = [];

  dataRows.forEach((row, i) => {
    // If row has fewer columns or is pipe separated
    if (row.length === 1 && row[0].includes('|')) {
      const pipeParts = row[0].split('|').map(s => s.trim());
      const name = pipeParts[0] || `Realtor Client #${i + 1}`;
      const agentName = pipeParts[1] || name;
      const address = pipeParts[2] || 'Prime Business District';
      const city = pipeParts[3] || 'Local Market';
      const phone = pipeParts[4] || '+1 (800) 555-0199';
      const email = pipeParts[5] || `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

      const generatedUrl = urlGenerator({
        name,
        agentName,
        address,
        city,
        phone,
        email,
        whatsapp: phone.replace(/[^0-9+]/g, '')
      });

      items.push({
        id: `csv-${Date.now()}-${i}`,
        name,
        agentName,
        address,
        city,
        phone,
        email,
        whatsapp: phone.replace(/[^0-9+]/g, ''),
        keyword: '5-Star Professional Realtor',
        generatedUrl
      });
      return;
    }

    const name = row[nameIdx] || `Realtor Client #${i + 1}`;
    const agentName = (agentIdx !== -1 && row[agentIdx]) ? row[agentIdx] : name;
    const address = (addressIdx !== -1 && row[addressIdx]) ? row[addressIdx] : (cityIdx !== -1 && row[cityIdx] ? `Main Office, ${row[cityIdx]}` : 'Prime Business District');
    const city = (cityIdx !== -1 && row[cityIdx]) ? row[cityIdx] : 'Prime Market';
    const phone = (phoneIdx !== -1 && row[phoneIdx]) ? row[phoneIdx] : '+1 (800) 555-0199';
    const email = (emailIdx !== -1 && row[emailIdx]) ? row[emailIdx] : `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const whatsapp = (waIdx !== -1 && row[waIdx]) ? row[waIdx] : phone.replace(/[^0-9+]/g, '');
    const keyword = (kwIdx !== -1 && row[kwIdx]) ? row[kwIdx] : '5-Star Professional Realtor';
    const salesVolume = (salesIdx !== -1 && row[salesIdx]) ? row[salesIdx] : '$250M+';

    const generatedUrl = urlGenerator({
      name,
      agentName,
      address,
      city,
      phone,
      email,
      whatsapp,
      primaryKeyword: keyword,
      salesVolume
    });

    items.push({
      id: `csv-${Date.now()}-${i}`,
      name,
      agentName,
      address,
      city,
      phone,
      email,
      whatsapp,
      keyword,
      salesVolume,
      generatedUrl
    });
  });

  return items;
};

/**
 * Export processed batch realtor items to downloadable CSV file with Live URLs & TinyURLs
 */
export const exportBatchRealtorsToCsv = (
  items: BatchRealtorItem[],
  filename: string = 'Realtor_Clients_Live_Website_URLs.csv'
) => {
  const headers = [
    'Business / Brokerage Name',
    'Lead Agent Name',
    'City / Target Market',
    'Phone Number',
    'Email Address',
    'Office Address',
    'WhatsApp Number',
    'SEO Target Keyword',
    'Live_Website_URL',
    'TinyURL_Short_Link'
  ];

  const escapeCell = (val: string = '') => `"${String(val).replace(/"/g, '""')}"`;

  const rows = items.map(item => [
    escapeCell(item.name),
    escapeCell(item.agentName || item.name),
    escapeCell(item.city),
    escapeCell(item.phone),
    escapeCell(item.email),
    escapeCell(item.address || ''),
    escapeCell(item.whatsapp || item.phone),
    escapeCell(item.keyword || '5-Star Professional Realtor'),
    escapeCell(item.generatedUrl || ''),
    escapeCell(item.tinyUrl || item.generatedUrl || '')
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generates ready-to-use sample CSV template for downloading
 */
export const downloadSampleCsvTemplate = () => {
  const sampleData = `Name,Agent Name,Address,City,Phone,Email,WhatsApp,SEO Keyword,Sales Volume
Vance & Co. Luxury Real Estate,Marcus Vance,"1240 Spring Street, Paso Robles, CA 93446","Paso Robles, CA",+1 (805) 238-9900,marcus@vanceproperties.com,+18052389900,"5-Star Professional Realtor","$380M+"
Central Valley Prime Realty,David Sterling,"7110 N Fresno St, Fresno, CA 93720","Fresno, CA",+1 (559) 438-2200,david@fresnoprimerealty.com,+15594382200,"Premier Luxury Realtor","$420M+"
Montecito & Riviera Real Estate,Victoria Kensington,"1150 Coast Village Rd, Santa Barbara, CA 93108","Santa Barbara, CA",+1 (805) 969-4400,victoria@santabarbaraluxury.com,+18059694400,"Top-Tier Luxury Real Estate Specialist","$650M+"
Waterloo Tech-Corridor Estates,Liam Gallagher,"7 Erb St W, Waterloo, ON N2L 1S8","Waterloo, ON",+1 (519) 886-3000,liam@waterlooestates.ca,+15198863000,"Trusted Luxury Realtor","$290M+"
Grand River Heritage Realty,Emily Chen,"305 King St W, Kitchener, ON N2G 1B9","Kitchener, ON",+1 (519) 745-8000,emily@grandriverheritage.com,+15197458000,"Local Real Estate Consultant","$240M+"`;

  const blob = new Blob(['\uFEFF' + sampleData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Realtor_Bulk_Upload_Template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
