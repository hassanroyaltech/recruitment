import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

const TermOfUse = (props) => (
  <Modal
    className="modal-dialog-centered"
    size="lg"
    isOpen={props.isOpen}
    toggle={() => props.closeModal()}
  >
    <div className="modal-header border-0 bg-primary">
      <h5 className="modal-title mt-0 text-white font-16">Terms Of Use</h5>
      <button
        type="button"
        className="close text-white"
        data-dismiss="modal"
        aria-hidden="true"
        onClick={() => props.closeModal()}
      >
        <i className="fas fa-times" />
      </button>
    </div>
    <ModalBody
      className="modal-body"
      style={{ overflow: 'scroll', 'max-height': '70vh' }}
    >
      <p>Last Revision Date: 21/03/2020</p>
      <p>Elevatus Inc.</p>
      <p> Craigmuir Chambers, Road Town, </p>
      <p> Tortola, British Virgin Islands</p>
      <p>
        Welcome to Elevatus Inc. Terms of Use agreement. For purposes of this
        agreement, “Site” refers to the Company’s website, which can be accessed at{' '}
        <a href="https://elevatus.io">https://elevatus.io</a>. “Service” refers to
        the Company’s services accessed via the Site, in which users can post
        vacancies, assessments, interviews and also to track, hire or get hired. Our
        Privacy Policy applies to any User of our Products or Platform. Our
        registered users, commonly referred to as recruiters, employers, headhunters
        or candidates (”Users”) share their professional identities, share video
        content and engage in the hiring process. Others, namely people invited to
        interview who are not registered are considered (”Visitors”). Users are
        divided into what we call ”Recruiters” (anyone who uses the platform to find,
        assess or hire talent) and ”Candidates”. The terms “we,” “us,” and “our”
        refer to the Company. “You” refers to you, as a user of our Site or our
        Service.
      </p>
      <p>
        The following Terms of Use apply when you view or use the Service via our
        website located at <a href="https://elevatus.io">https://elevatus.io</a>.
      </p>
      <p>
        Please review the following terms carefully. By accessing or using the
        Service, you signify your agreement to these Terms of Use.{' '}
        <b>
          If you do not agree to be bound by these Terms of Use in their entirety,
          you may not access or use the Service.
        </b>
      </p>
      <p>
        At Elevatus, our mission is to simplify and enhance the world’s hiring
        processes through advancements in technology, specifically in the development
        of artificial intelligence and the augmentation of data-driven learning
        algorithms. For the world to trust our technology, we are committed to
        transparency about the data we collect about you, how it is used, with whom
        it is shared and under what context.
      </p>
      <h5>Privacy Policy</h5>
      <p>
        The Company respects the privacy of its Service users. Please refer to the
        Company’s Privacy Policy found here:{' '}
        <a href="https://elevatus.io/legal/privacy-policy">
          https://elevatus.io/legal/privacy-policy
        </a>{' '}
        which explains how we collect, use, and disclose information that pertains to
        your privacy. When you access or use the Service, you signify your agreement
        to the Privacy Policy as well as these Terms of Use.
      </p>
      <h5>About the Service</h5>
      <p>
        The Service, depending on whether you are an ‘Applicant’ or a Recruiter’,
        allows you to perform functions such as, but not limited to: register, login,
        design and publish a career portal, setup hiring pipelines, video assessment
        pipelines and create custom filters, create a personal profile, invite
        teammates, upload data, personal or otherwise for the sole purpose of hiring,
        such as resumes in document or video formats or both. It allows you to source
        candidates, and get recommendations for jobs, candidates and other functions
        related to recruitment, and the human resources pipeline.
      </p>
      <h6>Use Restrictions</h6>
      <p>
        Your permission to use the Site is conditioned upon the following use,
        posting and conduct restrictions:
      </p>
      <p>You agree that you will not under any circumstances:</p>
      <ul>
        <li>
          access the Service for any reason other than your personal, non-commercial
          use solely as permitted by the normal functionality of the Service,
        </li>
        <li>
          collect or harvest any personal data of any user of the Site or the Service{' '}
        </li>
        <li>
          use the Site or the Service for the solicitation of business in the course
          of trade or in connection with a commercial enterprise;
        </li>
        <li>
          distribute any part or parts of the Site or the Service without our
          explicit written permission (we grant the operators of public search
          engines permission to use spiders to copy materials from the site for the
          sole purpose of creating publicly-available searchable indices but retain
          the right to revoke this permission at any time on a general or specific
          basis);
        </li>
        <li>
          use the Service for any unlawful purpose or for the promotion of illegal
          activities;
        </li>
        <li>attempt to, or harass, abuse or harm another person or group;</li>
        <li>use another user’s account without permission;</li>
        <li>intentionally allow another user to access your account; </li>
        <li>provide false or inaccurate information when registering an account;</li>
        <li>
          interfere or attempt to interfere with the proper functioning of the
          Service;
        </li>
        <li>
          make any automated use of the Site, the Service or the related systems, or
          take any action that we deem to impose or to potentially impose an
          unreasonable or disproportionately large load on our servers or network
          infrastructure;
        </li>
        <li>
          bypass any robot exclusion headers or other measures we take to restrict
          access to the Service, or use any software, technology, or device to
          scrape, spider, or crawl the Service or harvest or manipulate data;{' '}
        </li>
        <li>
          circumvent, disable or otherwise interfere with any security-related
          features of the Service or features that prevent or restrict use or copying
          of content, or enforce limitations on use of the Service or the content
          accessible via the Service; or{' '}
        </li>
        <li>
          publish or link to malicious content of any sort, including that intended
          to damage or disrupt another user’s browser or computer.
        </li>
      </ul>
      <h5>Posting and Conduct Restrictions</h5>
      <p>
        When you create an account, either as an Applicant or a Recruiter, you may be
        able to provide (“User Content”) to the Service. You are solely responsible
        for the User Content that you post, upload, link to or otherwise make
        available via the Service.{' '}
      </p>
      <p>
        You agree that we are only acting as a passive conduit for your online
        distribution and publication of your User Content. The Company, however,
        reserves the right to remove any User Content from the Service at its sole
        discretion.
      </p>
      <p>
        We grant you permission to use and access the Service, subject to the
        following express conditions surrounding User Content. You agree that failure
        to adhere to any of these conditions constitutes a material breach of these
        Terms.{' '}
      </p>
      <p>
        By transmitting and submitting any User Content while using the Service, you
        agree as follows:
      </p>
      <ul>
        <li>
          You are solely responsible for your account and the activity that occurs
          while signed in to or while using your account;
        </li>
        <li>
          You will not post information that is malicious, libelous, false or
          inaccurate;
        </li>
        <li>
          You will not post any information that is abusive, threatening, obscene,
          defamatory, libelous, or racially, sexually, religiously, or otherwise
          objectionable and offensive;
        </li>
        <li>
          You retain all ownership rights in your User Content but you are required
          to grant the following rights to the Site and to users of the Service as
          set forth more fully under the “License Grant” and “Intellectual Property”
          provisions below: When you upload or post User Content to the Site or the
          Service, you grant to the Site a worldwide, non-exclusive, royalty-free,
          transferable license to use, reproduce, distribute, prepare derivative
          works of, display, and perform that Content in connection with the
          provision of the Service; and you grant to each user of the Service, a
          worldwide, non-exclusive, royalty-free license to access your User Content
          through the Service, and to use, reproduce, distribute, prepare derivative
          works of, display and perform such Content to the extent permitted by the
          Service and under these Terms of Use;
        </li>
        <li>
          You will not submit content that is copyrighted or subject to third party
          proprietary rights, including privacy, publicity, trade secret, or others,
          unless you are the owner of such rights or have the appropriate permission
          from their rightful owner to specifically submit such content; and
        </li>
        <li>
          You hereby agree that we have the right to determine whether your User
          Content submissions are appropriate and comply with these Terms of Service,
          remove any and/or all of your submissions, and terminate your account with
          or without prior notice.
        </li>
      </ul>
      <p>
        You understand and agree that any liability, loss or damage that occurs as a
        result of the use of any User Content that you make available or access
        through your use of the Service is solely your responsibility. The Site is
        not responsible for any public display or misuse of your User Content.{' '}
      </p>
      <p>
        The Site does not, and cannot, pre-screen or monitor all User Content.
        However, at our discretion, we, or technology we employ, may monitor and/or
        record your interactions and/or use your non-personally identifiable
        information as training data to improve our Service.
      </p>
      <h5>Product and Platform</h5>
      <p>
        As a Visitor of our Platform or User of our Products, the collection, use and
        sharing of your personal data are subject to this Privacy Policy and updates.
        This Privacy Policy applies to your use of our Products and our Platform.
      </p>
      <h5>Online Content Disclaimer</h5>
      <p>
        Opinions, advice, statements, offers, or other information or content made
        available through the Service, but not directly by the Site, are those of
        their respective authors, and should not necessarily be relied upon. Such
        authors are solely responsible for such content.{' '}
      </p>
      <p>
        We do not guarantee the accuracy, completeness, or usefulness of any
        information on the Site or the Service nor do we adopt nor endorse, nor are
        we responsible for, the accuracy or reliability of any opinion, advice, or
        statement made by other parties. We take no responsibility and assume no
        liability for any User Content that you or any other user or third party
        posts or sends via the Service. Under no circumstances will we be responsible
        for any loss or damage resulting from anyone’s reliance on information or
        other content posted on the Service, or transmitted to users.
      </p>
      <p>
        Though we strive to enforce these Terms of Use, you may be exposed to User
        Content that is inaccurate or objectionable when you use or access the Site
        or the Service. We reserve the right, but have no obligation, to monitor the
        materials posted in the public areas of the Site or the Service or to limit
        or deny a user’s access to the Service or take other appropriate action if a
        user violates these Terms of Use or engages in any activity that violates the
        rights of any person or entity or which we deem unlawful, offensive, abusive,
        harmful or malicious. E-mails sent between you and other participants that
        are not readily accessible to the general public will be treated by us as
        private to the extent required by applicable law. The Company shall have the
        right to remove any material that in its sole opinion violates, or is alleged
        to violate, the law or this agreement or which might be offensive, or that
        might violate the rights, harm, or threaten the safety of users or others.
        Unauthorized use may result in criminal and/or civil prosecution under
        regional laws. If you become aware of a misuse of our Service or violation of
        these Terms of Use, please contact us at{' '}
        <a href="mailto:support@elevatus.jobs">support@elevatus.jobs</a>.
      </p>

      <h5>Links to Other Sites and/or Materials</h5>
      <p>
        As part of the Service, we may provide you with convenient links to third
        party website(s) (“Third Party Sites”) as well as content or items belonging
        to or originating from third parties (the “Third Party Applications, Software
        or Content”). These links are provided as a courtesy to Service subscribers.
        We have no control over Third Party Sites or Third Party Applications,
        Software or Content or the promotions, materials, information, goods or
        services available on these Third Party Sites or Third Party Applications,
        Software or Content. Such Third Party Sites and Third Party Applications,
        Software or Content are not investigated, monitored or checked for accuracy,
        appropriateness, or completeness, and we are not responsible for any Third
        Party Sites accessed through the Site or any Third Party Applications,
        Software or Content posted on, available through or installed from the Site,
        including the content, accuracy, offensiveness, opinions, reliability,
        privacy practices or other policies of or contained in the Third Party Sites
        or the Third Party Applications, Software or Content. Inclusion of, linking
        to or permitting the use or installation of any Third Party Site or any Third
        Party Applications, Software or Content does not imply our approval or
        endorsement. If you decide to leave the Site and access the Third Party Sites
        or to use or install any Third Party Applications, Software or Content, you
        do so at your own risk and you should be aware that our terms and policies,
        including these Terms of Use, no longer govern. You should review the
        applicable terms and policies, including privacy and data gathering
        practices, of any Third Party Site to which you navigate from the Site or
        relating to any applications you use or install from the Third Party Site.
      </p>
      <h5>License Grant</h5>
      <p>
        By posting any User Content via the Service, you expressly grant, and you
        represent and warrant that you have a right to grant, to the Company a
        royalty-free, sublicensable, transferable, perpetual, irrevocable,
        non-exclusive, worldwide license to use, reproduce, modify, publish, list
        information regarding, edit, translate, distribute, publicly perform,
        publicly display, and make derivative works of all such User Content and your
        name, voice, and/or likeness as contained in your User Content, if
        applicable, in whole or in part, and in any form, media or technology,
        whether now known or hereafter developed, for use in connection with the
        Service.
      </p>
      <h5>Intellectual Property Rights</h5>
      <p>
        You acknowledge and agree that we and our licensors retain ownership of all
        intellectual property rights of any kind related to the Service, including
        applicable copyrights, trademarks and other proprietary rights. Other product
        and company names that are mentioned on the Service may be trademarks of
        their respective owners. We reserve all rights that are not expressly granted
        to you under these Terms of Use.
      </p>
      <h5>Email may not be used to Provide Notice</h5>
      <p>
        Communications made through the Service’s email and messaging system will not
        constitute legal notice to the Site, the Service, or any of its officers,
        employees, agents or representatives in any situation where legal notice is
        required by contract or any law or regulation.
      </p>
      <h5>User Consent to Receive Communications in Electronic Form</h5>
      <p>
        For contractual purposes, you: (a) consent to receive communications from us
        in an electronic form via the email address you have submitted; and (b) agree
        that all Terms of Use, agreements, notices, disclosures, and other
        communications that we provide to you electronically satisfy any legal
        requirement that such communications would satisfy if it were in writing. The
        foregoing does not affect your non-waivable rights.
      </p>
      <p>
        We may also use your email address to send you other messages, including
        information about the Site or the Service and special offers. You may opt out
        of such email by changing your account settings, using the “Unsubscribe” link
        in the message, or by sending an email to{' '}
        <a href="mailto:support@elevatus.jobs">support@elevatus.jobs</a>. Opting out
        may prevent you from receiving messages regarding the Site, the Service or
        special offers.
      </p>
      <h5>Warranty Disclaimer</h5>
      <p>
        THE SERVICE, IS PROVIDED “AS IS,” WITHOUT WARRANTY OF ANY KIND. WITHOUT
        LIMITING THE FOREGOING, WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER
        EXPRESS, IMPLIED OR STATUTORY, REGARDING THE SERVICE INCLUDING WITHOUT
        LIMITATION ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
        TITLE, SECURITY, ACCURACY AND NON-INFRINGEMENT. WITHOUT LIMITING THE
        FOREGOING, WE MAKE NO WARRANTY OR REPRESENTATION THAT ACCESS TO OR OPERATION
        OF THE SERVICE WILL BE UNINTERRUPTED OR ERROR FREE. YOU ASSUME FULL
        RESPONSIBILITY AND RISK OF LOSS RESULTING FROM YOUR DOWNLOADING AND/OR USE OF
        FILES, INFORMATION, CONTENT OR OTHER MATERIAL OBTAINED FROM THE SERVICE. SOME
        JURISDICTIONS LIMIT OR DO NOT PERMIT DISCLAIMERS OF WARRANTY, SO THIS
        PROVISION MAY NOT APPLY TO YOU.
      </p>
      <h5>Limitation of Damages; Release</h5>
      <p>
        TO THE EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE SITE, THE
        SERVICE, ITS AFFILIATES, DIRECTORS, OR EMPLOYEES, OR ITS LICENSORS OR
        PARTNERS, BE LIABLE TO YOU FOR ANY LOSS OF PROFITS, USE, OR DATA, OR FOR ANY
        INCIDENTAL, INDIRECT, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, HOWEVER
        ARISING, THAT RESULT FROM: (A) THE USE, DISCLOSURE, OR DISPLAY OF YOUR USER
        CONTENT; (B) YOUR USE OR INABILITY TO USE THE SERVICE; (C) THE SERVICE
        GENERALLY OR THE SOFTWARE OR SYSTEMS THAT MAKE THE SERVICE AVAILABLE; OR (D)
        ANY OTHER INTERACTIONS WITH USE OR WITH ANY OTHER USER OF THE SERVICE,
        WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER
        LEGAL THEORY, AND WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF
        SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF
        ITS ESSENTIAL PURPOSE. SOME JURISDICTIONS LIMIT OR DO NOT PERMIT DISCLAIMERS
        OF LIABILITY, SO THIS PROVISION MAY NOT APPLY TO YOU.
      </p>

      <h5>Modifications of Terms of Use</h5>
      <p>
        We can amend these Terms of Use at any time and will update these Terms of
        Use in the event of any such amendments. It is your sole responsibility to
        check the Site from time to time to view any such changes in this agreement.
        Your continued use of the Site or the Service signifies your agreement to our
        revisions to these Terms of Use. We will endeavor to notify you of material
        changes to the Terms by posting a notice on our homepage and/or sending an
        email to the email address you provided to us upon registration. For this
        additional reason, you should keep your contact and profile information
        current. Any changes to these Terms (other than as set forth in this
        paragraph) or waiver of our rights hereunder shall not be valid or effective
        except in a written agreement bearing the physical signature of one of our
        officers. No purported waiver or modification of this agreement on our part
        via telephonic or email communications shall be valid.
      </p>

      <h5>General Terms</h5>
      <p>
        If any part of this Terms of Use agreement is held or found to be invalid or
        unenforceable, that portion of the agreement will be construed as to be
        consistent with applicable law while the remaining portions of the agreement
        will remain in full force and effect. Any failure on our part to enforce any
        provision of this agreement will not be considered a waiver of our right to
        enforce such provision. Our rights under this agreement survive any transfer
        or termination of this agreement.
      </p>

      <p>
        You agree that any cause of action related to or arising out of your
        relationship with the Company must commence within ONE year after the cause
        of action accrues. Otherwise, such cause of action is permanently barred.
      </p>
      <p>
        These Terms of Use and your use of the Site are governed by the laws of the
        British Virgin Islands, without regard to conflict of law provisions.
      </p>

      <p>
        We may assign or delegate these Terms of Service and/or our Privacy Policy,
        in whole or in part, to any person or entity at any time with or without your
        consent. You may not assign or delegate any rights or obligations under the
        Terms of Service or Privacy Policy without our prior written consent, and any
        unauthorized assignment or delegation by you is void.
      </p>

      <p>
        YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF USE, UNDERSTAND THE TERMS
        OF USE, AND WILL BE BOUND BY THESE TERMS AND CONDITIONS. YOU FURTHER
        ACKNOWLEDGE THAT THESE TERMS OF USE TOGETHER WITH THE PRIVACY POLICY
        AVAILABLE AT THE LINK{' '}
        <a href="https://elevatus.io/legal/privacy-policy">
          https://elevatus.io/legal/privacy-policy
        </a>{' '}
        REPRESENT THE COMPLETE AND EXCLUSIVE STATEMENT OF THE AGREEMENT BETWEEN US
        AND THAT IT SUPERSEDES ANY PROPOSAL OR PRIOR AGREEMENT ORAL OR WRITTEN, AND
        ANY OTHER COMMUNICATIONS BETWEEN US RELATING TO THE SUBJECT MATTER OF THIS
        AGREEMENT.
      </p>
    </ModalBody>
  </Modal>
);

export default TermOfUse;
