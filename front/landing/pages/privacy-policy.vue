<template>
<div>
  <div class="content-wrapper">
    <Header />

    <section class="p-2">
      <div class="container">
          <header class="text-center">
           <h2 class="m-auto">WEBSITE PRIVACY POLICY</h2>
           <h4><span class="blanc-space ng-binding">https://textpocket.com</span></h4>
         </header> <div> <h3>I. PRIVACY AND DATA PROTECTION POLICY</h3>
          <p>Respecting the provisions of current legislation, TextPocket (hereinafter also Website) undertakes to adopt the necessary technical and organisational measures, according to the level of security appropriate to the risk of the data collected.</p>

          <h4>Laws incorporated in this privacy policy</h4>
          <p>This privacy policy is adapted to current Spanish and European legislation on the protection of personal data on the Internet. Specifically, it respects the following regulations:</p>

           <ul>
            <li>Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data (GDPR).</li>
            <li>Organic Law 3/2018, of 5 December, on the Protection of Personal Data and Guarantee of Digital Rights (LOPD-GDD).</li>
             <li>Royal Decree 1720/2007, of 21 December, approving the Regulation implementing Organic Law 15/1999, of 13 December, on the Protection of Personal Data (RDLOPD).</li>
            <li>Law 34/2002, of 11 July, on Information Society Services and Electronic Commerce (LSSI-CE).</li> </ul>

             <h4>Identity of the party responsible for the processing of personal data</h4>
             <p ng-show="content == 'personal'" class="ng-hide">The person responsible for the processing of personal data collected in TextPocket is: Juan Manuel Navarro, with NIF: 73566614X (hereinafter, Controller). His contact details are as follows:</p>
             <p>Dirección: <span class="blanc-space ng-binding">Pla de l'arc 81, Lliria, Valencia</span></p> <p>Teléfono de contacto: <span class="blanc-space ng-binding">613086944</span></p> <p>Email de contacto: <span class="blanc-space ng-binding">services@texpocket.com</span></p>

             <h4>Register of Personal Data</h4>

             <p>In compliance with the provisions of the RGPD and the LOPD-GDD, we inform you that the personal data collected by TextPocket, through the forms on their pages will be incorporated and will be treated in our file in order to facilitate, expedite and fulfill the commitments established between TextPocket and the user or the maintenance of the relationship established in the forms that this fill, or to meet a request or consultation of the same. Also, in accordance with the provisions of the RGPD and the LOPD-GDD, unless the exception provided in Article 30.5 of the RGPD applies, a record of processing activities that specifies, according to their purposes, the processing activities carried out and other circumstances established in the RGPD is maintained.</p>

              <h4>Principles applicable to the processing of personal data</h4>

             <p>The processing of the User's personal data shall be subject to the following principles set out in Article 5 of the GDPR and in Article 4 et seq. of Organic Law 3/2018, of 5 December, on the Protection of Personal Data and the guarantee of digital rights:</p>
              <ul>
               <li>Principle of lawfulness, fairness and transparency: the consent of the User shall be required at all times following fully transparent information on the purposes for which the personal data are collected.</li>

                <li>Purpose limitation principle: personal data will be collected for specified, explicit and legitimate purposes.</li>

                <li>Principle of data minimisation: personal data collected will be only that which is strictly necessary in relation to the purposes for which they are processed.</li>

               <li>Accuracy principle: personal data must be accurate and always up to date.</li>

                <li>Principle of limitation of the storage period: personal data shall only be kept in a form that allows the identification of the User for the time necessary for the purposes for which they are processed.</li>

               <li>Principle of integrity and confidentiality: personal data shall be processed in such a way as to ensure their security and confidentiality.</li>
               <li>Principle of proactive accountability: the Controller shall be responsible for ensuring that the above principles are complied with.</li>
                </ul>
                <h4>Categories of personal data</h4>

                <p ng-show="opcion == 'opcionA'" class="">The categories of data processed by TextPocket are only identifying data. Under no circumstances are special categories of personal data processed within the meaning of Article 9 of the GDPR.</p>

                <p ng-show="opcion == 'opcionB'" class="ng-hide">The categories of data processed by TextPocket are both identifying data and special categories of personal data within the meaning of Article 9 of the GDPR.</p> <p ng-show="opcion == 'opcionB'" class="ng-hide">Special categories of personal data are understood to be data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data intended to uniquely identify a natural person, data relating to health or data relating to the sex life or sexual orientation of a natural person.</p>

                <p ng-show="opcion == 'opcionB'" class="ng-hide">For the processing of special categories of personal data, the explicit consent of the User for one or more specific purposes shall in any case be required.</p>

                 <h4>Legal basis for the processing of personal data</h4>

                <p>The legal basis for the processing of personal data is consent. TextPocket undertakes to obtain the express and verifiable consent of the User to the processing of his personal data for one or more specific purposes.</p>

                 <p>On those occasions when the User must or may provide their data through forms to make enquiries, request information or for reasons related to the content of the Website, they will be informed in the event that the completion of any of them is compulsory because they are essential for the correct development of the operation carried out.</p>

                 <h4>Purposes of the processing for which the personal data is used</h4>

                 <p>Personal data are collected and managed by TextPocket in order to facilitate, expedite and fulfil the commitments established between the website and the user or the maintenance of the relationship established in the forms that the latter fills or to respond to a request or query.</p>
                 <p>Likewise, the data may be used with a commercial purpose of personalisation, operational and statistical, and activities of the corporate purpose of TextPocket, as well as for the extraction, storage of data and marketing studies to adapt the content offered to the user, as well as to improve the quality, operation and navigation through the website.</p>

                  <p>At the time personal data is obtained, the User will be informed about the specific purpose(s) of the processing for which the personal data will be used, i.e. the use(s) to which the collected information will be put.</p>

                 <h4>Retention periods of personal data</h4> <p>Personal data will only be retained for the minimum time necessary for the purposes of their processing and, in any case, only for the following period: 10 years, or until the User requests their deletion.</p>

                 <p>At the time the personal data is obtained, the User will be informed of the period for which the personal data will be retained or, where this is not possible, the criteria used to determine this period.</p>

                 <h4>Recipients of personal data</h4>

                 <p ng-show="compartir == 'no'" class="">The User's personal data will not be shared with third parties.</p> <p ng-show="compartir == 'no'" class="">In any case, at the time the personal data is collected, the User will be informed of the recipients or categories of recipients of the personal data.</p>

                 <p ng-show="compartir == 'si'" class="ng-hide">In the event that the Controller intends to transfer personal data to a third country or international organisation, the User will be informed at the time the personal data are collected about the third country or international organisation to which the data are intended to be transferred, as well as about the existence or absence of an adequacy decision of the Commission.</p>

                 <h4>Personal data of minors</h4>
                 <p>In compliance with the provisions of Article 8 of the GDPR and Article 7 of the Organic Law 3/2018 of 5 December on the Protection of Personal Data and the Guarantee of Digital Rights, only persons over the age of 14 may consent to the processing of their personal data in a lawful manner by TextPocket. In the case of children under the age of 14, the consent of the parents or guardians is required for the processing and the processing is only lawful to the extent that the parents or guardians have given their consent.</p>

                 <h4>Secrecy and security of personal data</h4>
                 <p>TextPocket undertakes to adopt the necessary technical and organisational measures, according to the level of security appropriate to the risk of the data collected, so as to ensure the security of personal data and to prevent the accidental or unlawful destruction, loss or alteration of personal data transmitted, stored or otherwise processed, or the unauthorised communication of or access to such data.</p>

                 <p>However, because TextPocket cannot guarantee the impregnability of the internet or the total absence of hackers or others fraudulently accessing personal data, the Data Controller undertakes to notify the User without undue delay when a breach of security of personal data occurs that is likely to result in a high risk to the rights and freedoms of natural persons. In accordance with Article 4 of the GDPR, a breach of security of personal data means any breach of security resulting in the accidental or unlawful destruction, loss or alteration of personal data transmitted, stored or otherwise processed, or the unauthorised disclosure of or access to such data.</p> <p>Personal data shall be treated as confidential by the Controller, who undertakes to inform and to ensure by means of a legal or contractual obligation that such confidentiality is respected by its employees, partners, and any person to whom it makes the information accessible.</p>

                 <h4>Rights arising from the processing of personal data</h4>

                 <p>The User has over TextPocket and may, therefore, exercise against the Controller the following rights recognised in the RGPD and the Organic Law 3/2018 of 5 December on the Protection of Personal Data and guarantee of digital rights:</p>
                  <ul>
                   <li>Right of access: this is the right of the User to obtain confirmation of whether or not TextPocket is processing their personal data and, if so, to obtain information about their specific personal data and the processing that TextPocket has carried out or is carrying out, as well as, among others, the information available on the origin of such data and the recipients of the communications made or planned of the same.</li>

                    <li>Right of erasure ("the right to be forgotten"): This is the User's right, unless otherwise provided for by law, to obtain the erasure of his or her personal data when it is no longer necessary for the purposes for which it was collected or processed; the User has withdrawn his or her consent to the processing and the processing has no other legal basis; the User objects to the processing and there is no other legitimate reason to continue the processing; the personal data have been processed unlawfully; the personal data must be erased in compliance with a legal obligation; or the personal data have been obtained as a result of a direct offer of information society services to a child under 14 years of age. In addition to erasure, the Controller shall, taking into account the technology available and the cost of its implementation, take reasonable steps to inform controllers who are processing the personal data of the data subject's request for erasure of any link to those personal data.</li>
                    <li>Right to restriction of processing: This is the User's right to restrict the processing of his or her personal data. The User has the right to obtain the restriction of processing where the User contests the accuracy of his or her personal data; the processing is unlawful; the Controller no longer needs the personal data, but the User needs it to make claims; and where the User has objected to the processing.</li>
                    <li>Right to data portability: Where processing is carried out by automated means, the User shall have the right to receive from the Controller his or her personal data in a structured, commonly used and machine-readable format and to transmit it to another controller. Where technically feasible, the Controller shall transmit the data directly to that other controller.</li>
                     <li>Right of opposition: This is the right of the User not to have their personal data processed or to cease the processing of their personal data by TextPocket.</li>

                      <li>Right not to be subject to a decision based solely on automated processing, including profiling: The right of the user not to be subject to an individualised decision based solely on automated processing of personal data, including profiling, existing unless otherwise provided by law.</li>

                       </ul> <p>Therefore, the User may exercise his/her rights by means of a written communication addressed to the Data Controller with the reference "RGPD https://textpocket.com", specifying</p>

                       <ul>
                        <li>Name, surname(s) of the User and a copy of the User's National Identity Document. In cases where representation is permitted, it will also be necessary to identify the person representing the User by the same means, as well as the document accrediting the representation. The photocopy of the DNI may be substituted by any other legally valid means that accredits identity.</li>
                        <li>Request with the specific reasons for the request or information to which access is sought.</li>
                        <li>Address for notification purposes.</li>
                        <li>Date and signature of the applicant.</li>
                        <li>Any document that accredits the request being made.</li> </ul>

                       <p>This application and any other attached documents may be sent to the following address and/or e-mail address:</p>
                       <p>Postal address: Pla de l'arc 81, Lliria, Valencia, Spain.</p>
                       <p>E-mail: services@texpocket.com</p>
                       <h4>Links to third party websites</h4>
                       <p>The Website may include hyperlinks or links to websites of third parties other than TextPocket, which are not operated by TextPocket. The owners of such websites will have their own data protection policies, being themselves, in each case, responsible for their own files and their own privacy practices.</p>
                       <h4>Complaints to the supervisory authority</h4>
                       <p>n the event that the User considers that there is a problem or infringement of the regulations in force in the way in which his or her personal data is being processed, he or she shall have the right to effective judicial protection and to lodge a complaint with a supervisory authority, in particular, in the State in which he or she has his or her habitual residence, place of work or place of the alleged infringement. In the case of Spain, the supervisory authority is the Spanish Data Protection Agency (http://www.agpd.es).</p>

                        <h3>II. ACCEPTANCE AND CHANGES TO THIS PRIVACY POLICY</h3>

                        <p>It is necessary that the User has read and agrees with the conditions on the protection of personal data contained in this Privacy Policy, as well as that he/she accepts the processing of his/her personal data so that the Data Controller can proceed in the manner, during the periods and for the purposes indicated. The use of the Website implies acceptance of the Privacy Policy of the same.</p>

                        <p>TextPocket reserves the right to modify its Privacy Policy, according to its own criteria, or motivated by a legislative, jurisprudential or doctrinal change of the Spanish Data Protection Agency. Changes or updates to this Privacy Policy will not be explicitly notified to the User. The User is recommended to consult this page periodically to keep abreast of the latest changes or updates.</p>

                        <p>This Privacy Policy was updated to adapt to Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data (RGPD) and to Organic Law 3/2018 of 5 December on the Protection of Personal Data and guarantee of digital rights.</p>

                        </div> </div>
    </section>
  </div>

  <Footer />
</div>
</template>
