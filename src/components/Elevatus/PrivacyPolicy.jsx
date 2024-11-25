import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

const PrivacyPolicy = (props) => (
  <Modal
    className="modal-dialog-centered"
    size="lg"
    isOpen={props.isOpen}
    toggle={() => props.closeModal()}
  >
    <div className="modal-header border-0 bg-primary">
      <h5 className="modal-title mt-0 text-white font-16">Privacy Policy</h5>
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
      <p>Last Revision Date: 18/03/2020</p>
      <p>Elevatus Inc.</p>
      <p> Craigmuir Chambers, Road Town, </p>
      <p> Tortola, British Virgin Islands</p>

      <p>
        At Elevatus, our mission is to simplify and enhance the world’s hiring
        processes through advancements in technology, specifically in the development
        of artificial intelligence and the augmentation of data-driven learning
        algorithms. For the world to trust our technology, we are committed to
        transparency about the data we collect about you, how it is used, with whom
        it is shared and under what context.
      </p>

      <h5>Disclaimer</h5>
      <p>
        Elevatus is committed to comply with all regional privacy laws and
        regulations such as GDPR.
      </p>
      <p>
        This Privacy Policy applies when you use our Products (described below). We
        offer our users choices about the data we collect, use and share as described
        in this Privacy Policy.
      </p>

      <h5>Introduction</h5>
      <p>
        We are an AI-powered hiring platform. People use our (”Products”) -
        constituent parts that make up our (”Platform”) - to post vacancies,
        assessments, interviews and also to track, hire or get hired. Our Privacy
        Policy applies to any User of our Products or Platform. Our registered users,
        commonly referred to as recruiters, employers, headhunters or candidates
        (”Users”) share their professional identities, share video content and engage
        in the hiring process. Others, namely people invited to interview who are not
        registered are considered (”Visitors”). Users are divided into what we call
        ”Recruiters” (anyone who uses the platform to find, assess or hire talent)
        and ”Candidates”.
      </p>
      <h5>Product and Platform</h5>
      <p>
        As a Visitor of our Platform or User of our Products, the collection, use and
        sharing of your personal data are subject to this Privacy Policy and updates.
        This Privacy Policy applies to your use of our Products and our Platform.
      </p>

      <h5>Changes to the Policy</h5>
      <p>
        Elevatus (”we” or ”us”) can modify this Privacy Policy, and if we make
        material changes to it, we will provide notice through our Products, or by
        other means, to provide you the opportunity to review the changes before they
        become effective. If you object to any changes, you may close your account.
        Changes to the Privacy Policy apply to your use of our Products after the
        ”effective date”.
      </p>

      <h5>Data we collect</h5>
      <h6>Registration</h6>
      <p>
        Upon signing up as ”Recruiter”, you are required to enter your first name,
        last name, company name, email address, and an encrypted password (which is
        unknown to us). You are then directed to the recruiter profile builder, upon
        which you may disclose more information about your company.
      </p>
      <p>
        Upon signing up as a ”Candidate”, you are required to enter your first name,
        last name, email address, and an encrypted password. You may share your phone
        number if you choose. Afterwards, you are directed to the candidate profile
        builder, upon which you may provide data not limited to your educational
        background, work experience, achievements and a video CV where you may
        present yourself. These will be visible in your profile to those who have a
        link to your profile, namely the recruiter on whose career portal you have
        signed up.
      </p>

      <h6>Career Portal</h6>
      <p>
        As a recruiter, you may create a Career Portal which acts as a decentralized
        platform for hiring. This portal’s appearance and content may be configured
        to your own brand. You provide data such as information about job vacancies,
        company photos (which may or may not include personal photos), testimonials,
        marketing videos, and social media links. You, the recruiter, are responsible
        for any appropriation of trademarks, or company properties or data through
        the portal as the link of the career portal is private until you share it. As
        a candidate, you may apply to jobs on the career portal and undergo a sign-up
        process from there.
      </p>
      <p>
        This will require you to disclose the information mentioned in: Data We
        Collect - Registration. And also to provide more data depending on the
        requirements of the vacancy you wish to apply for.
      </p>

      <h6>Applicant Tracking System (ATS)</h6>
      <p>
        As a recruiter you may use the ATS to facilitate the hiring process. In which
        you may post jobs, and view and track candidates who have applied. You may
        also search for candidates based on the jobs you have posted, and you may
        require them to upload or record videos of themselves to apply.
      </p>

      <h6>Video Assessment</h6>
      <p>
        As a recruiter you may use the Video Assessment to create simple interviews
        for any purpose, including but not limited to hiring. Then you proceed to
        send a generated link via email to any person of interest.
      </p>
      <p>
        The visitor may perform the interview after providing us with the name and
        the email address, and will be given a choice to either join Elevatus or
        leave after the interview. If they choose to join, they enter the
        registration process to become a candidate. As a visitor or candidate
        performing a video assessment, you are providing us and the recruiter with
        videos of you answering questions, which would be used for the purpose of
        assessment by the recruiter and for the purpose of technological enhancement
        by us.
      </p>

      <h6>Resume Matching Service (RMS) </h6>
      <p>
        As a recruiter you may upload a batch of resumes which we parse and extract
        data from to be matched with pre-existing job vacancies.
      </p>

      <h5>Data we collect for A.I.</h5>
      <p>
        You (the recruiter or the candidate) create your Elevatus profile (a complete
        profile helps you get the most from our Products).
      </p>
      <p>
        Our A.I. products require certain information to perform predictions, and for
        that we encourage sharing more information. However, for the training,
        improvement or enhancement of our A.I. products, all information, commonly
        referred to as “Personally-Identifiable Information”, ”PII” or ”PII-data”
        such as your first and last name, your email, and phone number are excluded
        automatically from any training, improvement or enhancement. We attempt to
        use all other data such as, but not limited to: your skills or previous job
        titles and achievements as anonymized data for machine learning purposes and
        technological enhancement.
      </p>
      <p>
        For our recommendations engines, (ZuReccer, YoshiGraph and Semantica) we do
        not depend on any information that identifies you. For our personality
        analysis engines, we ensure that the videos we use are mathematically
        transformed into videos that cannot identify you while retaining potential of
        use through our own method of analyzing facial features. However, a
        prediction of your personality type as a candidate is given based on the
        video you have posted, which recruiters may view and read.
      </p>

      <h5>Legal Basis - Processing your personal data</h5>
      <h6>Contractual Obligations</h6>
      <p>
        We will process your personal data to fulfil our duties related to the hiring
        process.
      </p>
      <h6>Your Consent</h6>
      <p>
        Where you have given consent regarding the usage of your personal data,
        Elevatus will use your personal data as consented to. You are free to revoke
        this consent for the future without giving any reason.
      </p>
      <h6>Legitimate Interests</h6>
      <p>
        We process your personal data for the purposes of our legitimate interests.
        Our interests contain:
      </p>
      <ul>
        <li>The enhancement of our platform in general,</li>
        <li>
          The improvement of our learning algorithms and hence, the hiring process.
        </li>
        <li>
          The assurance of the functionality and safety of the website and our
          systems,
        </li>
        <li>Exercising legal rights or the protection from legal claims.</li>
      </ul>

      <h6>Compliance with Laws</h6>
      <p>
        We will process your personal data to comply with legal obligations, such as
        answering authority requests in the course of investigation proceedings.
      </p>

      <h5>Sharing your personal data</h5>
      <p>
        We share your data only with necessary third-party service providers such as
        but not limited to the provider of our video recording APIs, translation and
        speech-to-text APIs.
      </p>
      <p>
        We do not share your personal information including but not limited to name,
        address, contact information, credit card information, with third-party
        providers, except for billing purposes, and only what is required by the
        payment gateway provider.
      </p>

      <p>
        Your data may be shared with Government Authorities, Law Enforcement
        Officials and Courts as applicable.
      </p>

      <h5>International Data Transfer Safeguards</h5>
      <p>
        Elevatus will protect your data, regardless of whether it is inside or
        outside the European Economic Area (EEA). In case we need to share your
        personal data with any entity outside of the EEA, we will require their
        signature on approved standard contractual clauses to ensure that your
        personal data are adequately protected.
      </p>
      <h5>Data Retention Policy</h5>
      <h6>Object Storage</h6>
      <p>
        We store all data in Amazon S3/Google Cloud Storage until request for
        deletion of the account. Videos, resumes, documents and other objects are
        deleted automatically. A single cold backup remains for upto one year (varies
        with regional laws), for the purpose of account reactivation, unless an
        explicit request is made to delete the data beforehand. An agreement can be
        made to retain the cold backup for a shorter or longer duration prior to the
        creation of the account.
      </p>
      <h6>Tabular Storage</h6>
      <p>
        We store all the data until the request for deletion of the account. After
        which all data are purged from the database and all replicas, and
        denormalized forms and views are also deleted automatically.{' '}
      </p>
      <p>
        A single cold backup remains for upto one year (varies with regional laws),
        for the purpose of account reactivation, unless an explicit request is made
        to delete the data beforehand. An agreement can be made to retain the cold
        backup for a shorter or longer duration prior to the creation of the account.
      </p>

      <h6>Job Applications</h6>
      <p>
        If you applied for a job or a video assessment with us, we will retain your
        application for the duration of the recruiting process and to the extent
        permitted by applicable law after the end of the hiring process. Most
        applications will be deleted 6 months after rejection. Please note that some
        local laws may require or allow you to retain your data for longer periods.
      </p>
      <h6>Legal Action</h6>
      <p>
        We will keep your personal data if you take legal action against any Elevatus
        entity. The personal data will be deleted at the end of the legal proceeding.
      </p>
      <h5>Security</h5>
      <p>
        We have appropriate technical and organizational measures in place and signed
        contractual agreements with our service providers to protect your personal
        data, including, but not limited to loss, alteration or unauthorized access.
        Please note that any transmission of your personal data through the internet
        is at your own risk. Once we have received your data, we do our best to
        protect it.
      </p>

      <h5>Your Rights</h5>
      <p>
        At Elevatus, you own your data and have the choice to modify or delete your
        data completely at any moment. We would like to give you an overview of your
        rights to your personal data:
      </p>
      <h6>Right of access</h6>
      <p>
        You have the right to obtain access to your personal data and to get a copy
        of the personal data undergoing processing.
      </p>
      <h6>Right to rectification</h6>
      <p>
        You have the right to rectify inaccurate personal data or to append
        information. You can do so by logging in to your profile and making the
        necessary modifications. Your applications to job posts can be edited unless
        rejected.
      </p>
      <h6>Right to erasure</h6>
      <p>
        You have the right to request erasure of your profile for any reason. We
        assure you that all your information will be purged. You can do so by logging
        in to your profile, navigating to your account settings and requesting
        deletion from there.
      </p>

      <h6>Right to erasure of cold backups</h6>
      <p>
        We keep a cold backup of your data stored for up to one year (varies with
        regional data protection regulations and laws). After which will be
        automatically deleted.
      </p>
      <p>
        You can explicitly request deletion of your backups by logging in to your
        profile, by sending us an email with your request to
        <a href="mailto:support@elevatus.jobs"> support@elevatus.jobs</a>. Upon which
        we will be connected to one of our team members to help you.
      </p>
      <h6>Right to data portability</h6>
      <p>
        You have the right to receive your personal data in a structured,
        commonly-used and machine-readable format.
      </p>
      <h6>Right to restriction of processing</h6>
      <p>
        You can prevent Elevatus from processing your personal data. This restriction
        takes place especially during the assessment period of other personal data
        rights.
      </p>
      <h6>Right to object</h6>
      <p>
        You have the right to object to the processing if you doubt our legitimate
        interests in processing your personal data.
      </p>
      <h6>Right to lodge a complaint</h6>
      <p>
        You have the right to lodge a complaint with your local Data Protection
        Authority.
      </p>
      <h6>Identity Confirmation</h6>
      <p>
        We may need to confirm your identity, before we can deal with your enquiry.
        Please note that some of the rights are also subject to restrictions. Where
        your request has been rejected, we will provide you with relevant reasons.
      </p>
    </ModalBody>
  </Modal>
);

export default PrivacyPolicy;
