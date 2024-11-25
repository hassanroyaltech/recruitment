import React from 'react';

export function VideoView() {
  return (
    <div className="tab-pane p-3  " id="video_view" role="tabpanel">
      <div className="row">
        <div className="col-lg-12 col-xl-4">
          <div className="text-left">
            <h6>Admin Xyz</h6>
            <p className="m-0">example@gmail.com</p>
            <p className="m-0">IT Manager</p>
            <p>fahion Louviislem, United State of America</p>
            <div className="row mt-4 mb-3">
              <div className="col-lg-12 col-xl-12 d-lg-flex align-items-center">
                <div className="cddd">
                  {/* Progress bar  */}
                  <div className=" d-xl-flex d-inline-flex align-items-center mt-2">
                    <div className="progress-custom" data-value={30}>
                      <span className="progress-left">
                        <span className="progress-bar border-warning" />
                      </span>
                      <span className="progress-right">
                        <span className="progress-bar border-warning" />
                      </span>
                      <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                        <div className="text-out-cirle d-inline-table font-weight-bold">
                          <small className="font-14 text-nowrap">30 %</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Progress bar  */}
                </div>
                <div className="d-flex align-items-center ml-xl-5 mt-2">
                  <div className="port-like">
                    <button
                      type="button"
                      className="btn like-dislike btn-rounded"
                      data-toggle="button"
                      aria-pressed="true"
                    >
                      {' '}
                      <small className="text-primary align-text-top">6</small>
                      <span className="thum-e e-like text" />
                      <span className="thum-e e-like_fill text-active" />
                    </button>
                  </div>
                  <div className="port-like">
                    <button
                      type="button"
                      className="btn like-dislike btn-rounded"
                      data-toggle="button"
                      aria-pressed="true"
                    >
                      {' '}
                      <small className="text-primary align-text-top">1</small>
                      <span className="thum-e e-neutral text" />
                      <span className="thum-e e-neutral_fill text-active" />
                    </button>
                  </div>
                  <div className="port-like">
                    <button
                      type="button"
                      className="btn like-dislike btn-rounded"
                      data-toggle="button"
                      aria-pressed="true"
                    >
                      {' '}
                      <small className="text-primary align-text-top">0</small>
                      <span className="thum-e e-dislike text text-primary" />
                      <span className="thum-e e-dislike_fill text-active" />
                    </button>
                  </div>
                  <i
                    className="mdi mdi-share-variant cursor font-18 text-primary"
                    data-toggle="modal"
                    data-target=".share-modal"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix" />
          <div className="row mt-lg-5 mb-lg-5 d-m-r-block">
            <div className="col-lg-12 col-xl-12">
              <button
                type="button"
                className="btn d-inline-flex align-items-center btn-lg btn-analysis waves-effect waves-light mr-sm-3 my-2"
              >
                <i className="ejobs-icon-11-01-2 font-1 mr-1" />
                Personality analysis
              </button>
              <button type="button" className="btn btn-lg btn-primary">
                View Profile
              </button>
            </div>
          </div>
          <div className="d-flex align-items-center mt-3 mb-2">
            <p>
              <span className="font-weight-700 text-black">Keywords: </span>2 out of
              6
            </p>
          </div>
          <div className="row">
            <div className="col-sm-3 col-md-3 col-lg-2 col-xl-4 mt-2 mb-2">
              <span className="badge badge-pill badge-success rounded-lg p-2 pl-2 pr-2   w-100">
                PhotoShop
              </span>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-2 col-xl-4 mt-2 mb-2">
              <span className="badge badge-pill badge-success p-2 pl-2 pr-2   w-100">
                Illustrates
              </span>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-2 col-xl-4 mt-2 mb-2">
              <span className="badge badge-pill badge-muted p-2 pl-2 pr-2   w-100">
                Logo Design
              </span>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-2 col-xl-4 mt-2 mb-2">
              <span className="badge badge-pill badge-muted p-2 pl-2 pr-2   w-100">
                PhotoShop
              </span>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-2 col-xl-4 mt-2 mb-2">
              <span className="badge badge-pill badge-muted p-2 pl-2 pr-2   w-100">
                Illustrate
              </span>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-2 col-xl-4 mt-2 mb-2">
              <span className="badge badge-pill badge-muted p-2 pl-2 pr-2   w-100">
                Logo Design
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-xl-7 offset-xl-1 mt-3">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-xl-12">
              {/* Tab panes */}
              <div className="tab-content">
                <div
                  className="tab-pane active"
                  id="question_video_1"
                  role="tabpanel"
                >
                  <div className="card m-0">
                    <div className="card-body-none p-2">
                      <video
                        controls
                        poster="assets/images/home-slider-videos/Video-1769-Roza-Testemonials.jpg"
                        id="player"
                      >
                        {/* Video files */}
                        <source
                          src="https://www.elevatus.jobs/home-slider-videos/Video-1769-Roza-Testemonials.mp4"
                          type="video/mp4"
                          size={576}
                        />
                      </video>
                    </div>
                  </div>
                </div>
                <div className="tab-pane" id="question_video_2" role="tabpanel">
                  <div className="card m-0">
                    <div className="card-body-none p-2">
                      <video
                        controls
                        poster="assets/images/home-slider-videos/View_From_A_Blue_Moon_Trailer-HD.jpg"
                        id="player_2"
                      >
                        {/* Video files */}
                        <source
                          src="https://www.elevatus.jobs/home-slider-videos/Video-8624-MVI_2378_1.mp4"
                          type="video/mp4"
                          size={576}
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pl-3">
                <h5 className="font-16 text-primary font-weight-600">
                  Q1. Introduce Yourself
                </h5>
                <h4 className="font-16 font-weight-light mb-4">All Answer Videos</h4>
                <span className="nav nav-pills pl-1" role="tablist">
                  <div
                    className="card  b-radius-10 b-vertical-tabs_video   active waves-effect waves-light"
                    data-toggle="tab"
                    href="#question_video_1"
                    role="tab"
                  >
                    <div className="card-body-none p-0">
                      <div className="media">
                        <span className="p-relative">
                          <img
                            className="d-flex align-self-center rounded"
                            src="assets/images/users/user-3.jpg"
                            alt="Generic placeholder image"
                            height={70}
                          />
                          <i className="mdi mdi-play text-white overlay-img border-redious-5" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card float-lg-right  b-radius-10 b-vertical-tabs_video waves-effect waves-light"
                    data-toggle="tab"
                    href="#question_video_2"
                    role="tab"
                  >
                    <div className="card-body-none p-0">
                      <div className="media">
                        <span className="p-relative">
                          <img
                            className="d-flex align-self-center rounded"
                            src="assets/images/users/user-3.jpg"
                            alt="Generic placeholder image"
                            height={70}
                          />
                          <i className="mdi mdi-play text-white overlay-img" />
                        </span>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="d-lg-flex mt-2">
            <div className="col-sm-6 p-0 mb-4">
              <h4 className="font-14">Write A Comment</h4>
            </div>
            <div className="col-sm-6 p-0 mb-4">
              <div className="d-flex align-items-center float-xl-right float-lg-right">
                <h4 className="font-14">Rate This Answer </h4>
                <div className="d-flex align-items-center ml-4">
                  <div className="port-like">
                    <button
                      type="button"
                      className="btn like-dislike btn-rounded"
                      data-toggle="button"
                      aria-pressed="true"
                    >
                      <span className="thum-e e-like text" />
                      <span className="thum-e e-like_fill text-active" />
                    </button>
                  </div>
                  <div className="port-like">
                    <button
                      type="button"
                      className="btn like-dislike btn-rounded"
                      data-toggle="button"
                      aria-pressed="true"
                    >
                      <span className="thum-e e-neutral text" />
                      <span className="thum-e e-neutral_fill text-active" />
                    </button>
                  </div>
                  <div className="port-like">
                    <button
                      type="button"
                      className="btn like-dislike btn-rounded"
                      data-toggle="button"
                      aria-pressed="true"
                    >
                      <span className="thum-e e-dislike text text-primary" />
                      <span className="thum-e e-dislike_fill text-active" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <textarea
            required
            className="form-control mb-4"
            rows={5}
            placeholder="Type here comment..."
            defaultValue=""
          />
          <div className="w-100 text-right">
            <button type="button" className="btn btn-2 btn-primary">
              Send
            </button>
          </div>
          <div className="clearfix" />
          <div className="mt-4 d-block">
            <h4 className="font-16">All comments &amp; Ratings</h4>
            <div className="card w-100">
              <div className="p-3">
                <div className="clearfix" />
                <div className="row">
                  <div className="col-lg-4 col-xl-3">
                    <div className="d-flex align-items-center">
                      <img
                        src="assets/images/users/user-3.jpg"
                        className="thumb-md rounded-circle"
                        alt=""
                      />
                      <h5 className="font-14 text-nowrap">Admin xyz</h5>
                    </div>
                  </div>
                  <div className="col-lg-8 col-xl-9">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry scrambled it to make text of the printing
                      and typesetting industry scrambled a type specimen book text of
                      the dummy text of the printing printing and typesetting
                      industry scrambled dummy text of the printing.
                    </p>
                    <div className="clearfix" />
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="d-flex align-items-center">
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-like text" />
                              <span className="thum-e e-like_fill text-active" />
                            </button>
                          </div>
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-neutral text" />
                              <span className="thum-e e-neutral_fill text-active" />
                            </button>
                          </div>
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-dislike text text-primary" />
                              <span className="thum-e e-dislike_fill text-active" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <a href="#" className="text-perpal">
                          Reply
                        </a>
                      </div>
                      <div className="col-lg-2">
                        <i className="ion-ios7-clock-outline" /> 1d
                      </div>
                    </div>
                    <div className="row b-t-1 mt-3 mb-3">
                      <div className="col-lg-4 col-xl-3 mt-3  p-lg-0">
                        <div className="d-lg-flex align-items-center">
                          <img
                            src="assets/images/users/user-3.jpg"
                            className="thumb-md rounded-circle"
                            alt=""
                          />
                          <h5 className="font-12 font-10 ">Admin xyz</h5>
                        </div>
                      </div>
                      <div className="col-lg-8 col-xl-9 p-lg-0  mt-3">
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry scrambled it to make text of the .
                        </p>
                        <div className="clearfix" />
                      </div>
                      <div className="col-lg-4 col-xl-3 mt-3 p-lg-0">
                        <div className="d-lg-flex align-items-center">
                          <img
                            src="assets/images/users/user-3.jpg"
                            className="thumb-md rounded-circle"
                            alt=""
                          />
                          <h5 className="font-12 font-10"> Admin xyz</h5>
                        </div>
                      </div>
                      <div className="col-lg-8 col-xl-9 p-lg-0  mt-3">
                        <p>
                          Lorem Ipsum is simply dummy text of the printing and
                          typesetting industry scrambled it to make text of the .
                        </p>
                        <div className="clearfix" />
                      </div>
                      <div className="mt-2 w-100 b-t-1">
                        <div className="col-12 p-lg-0 mb-4">
                          <h4 className="font-14">Write A Comment</h4>
                        </div>
                        <textarea
                          required
                          className="form-control mb-4 w-100"
                          rows={5}
                          placeholder="Type here comment..."
                          defaultValue=""
                        />
                        <div className="text-right">
                          <button type="button" className="btn btn-2 btn-primary">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100">
              <div className="p-3">
                <div className="clearfix" />
                <div className="row">
                  <div className="col-lg-4 col-xl-3">
                    <div className="d-lg-flex align-items-center">
                      <img
                        src="assets/images/users/user-3.jpg"
                        className="thumb-md rounded-circle"
                        alt=""
                      />
                      <h5 className="font-14 text-nowrap"> Admin ABC</h5>
                    </div>
                  </div>
                  <div className="col-lg-8 col-xl-9">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry scrambled it to make text of the printing
                      and typesetting industry scrambled a type specimen book text of
                      the dummy text of the printing printing and typesetting
                      industry scrambled dummy text of the printing.
                    </p>
                    <div className="clearfix" />
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="d-flex align-items-center">
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-like text" />
                              <span className="thum-e e-like_fill text-active" />
                            </button>
                          </div>
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-neutral text" />
                              <span className="thum-e e-neutral_fill text-active" />
                            </button>
                          </div>
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-dislike text text-primary" />
                              <span className="thum-e e-dislike_fill text-active" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <a href="#" className="text-perpal">
                          Reply
                        </a>
                      </div>
                      <div className="col-lg-2">
                        <i className="ion-ios7-clock-outline" /> 1d
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card w-100">
              <div className="p-3">
                <div className="clearfix" />
                <div className="row">
                  <div className="col-lg-4 col-xl-3">
                    <div className="d-lg-flex align-items-center">
                      <img
                        src="assets/images/users/user-5.jpg"
                        className="thumb-md rounded-circle"
                        alt=""
                      />
                      <h5 className="font-14 text-nowrap"> Admin abc</h5>
                    </div>
                  </div>
                  <div className="col-lg-8 col-xl-9">
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry scrambled it to make text of the printing
                      and typesetting industry scrambled a type specimen book text of
                      the dummy text of the printing printing and typesetting
                      industry scrambled dummy text of the printing.
                    </p>
                    <div className="clearfix" />
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="d-flex align-items-center">
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-like text" />
                              <span className="thum-e  e-like_fill text-active" />
                            </button>
                          </div>
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-neutral text" />
                              <span className="thum-e e-neutral_fill text-active" />
                            </button>
                          </div>
                          <div className="port-like">
                            <button
                              type="button"
                              className="btn like-dislike btn-rounded"
                              data-toggle="button"
                              aria-pressed="true"
                            >
                              <span className="thum-e e-dislike text text-primary" />
                              <span className="thum-e e-dislike_fill text-active" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <a href="#" className="text-perpal">
                          Reply
                        </a>
                      </div>
                      <div className="col-lg-2">
                        <i className="ion-ios7-clock-outline" /> 1d
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
