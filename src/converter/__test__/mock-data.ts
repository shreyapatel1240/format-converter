export const mockString = `ProductID*4*8*15*16*23~
ProductID*a*b*c*d*e~
AddressID*42*108*3*14~
ContactID*59*26~`;

export const mockJson = {
  ProductID: [
    {
      ProductID1: '4',
      ProductID2: '8',
      ProductID3: '15',
      ProductID4: '16',
      ProductID5: '23',
    },
    {
      ProductID1: 'a',
      ProductID2: 'b',
      ProductID3: 'c',
      ProductID4: 'd',
      ProductID5: 'e',
    },
  ],
  AddressID: [
    {
      AddressID1: '42',
      AddressID2: '108',
      AddressID3: '3',
      AddressID4: '14',
    },
  ],
  ContactID: [
    {
      ContactID1: '59',
      ContactID2: '26',
    },
  ],
};

export const mockXml = `<?xml version="1.0" encoding="UTF-8" ?>
<root>
  <ProductID>
    <ProductID1>4</ProductID1>
    <ProductID2>8</ProductID2>
    <ProductID3>15</ProductID3>
    <ProductID4>16</ProductID4>
    <ProductID5>23</ProductID5>
  </ProductID>
  <ProductID>
    <ProductID1>a</ProductID1>
    <ProductID2>b</ProductID2>
    <ProductID3>c</ProductID3>
    <ProductID4>d</ProductID4>
    <ProductID5>e</ProductID5>
  </ProductID>
  <AddressID>
    <AddressID1>42</AddressID1>
    <AddressID2>108</AddressID2>
    <AddressID3>3</AddressID3>
    <AddressID4>14</AddressID4>
  </AddressID>
  <ContactID>
    <ContactID1>59</ContactID1>
    <ContactID2>26</ContactID2>
  </ContactID>
</root>`;
