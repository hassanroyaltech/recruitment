import React from 'react';
import { Modal } from 'reactstrap';

export function AddCustomFiltersModal(props) {
  return (
    <Modal isOpen={props.isOpen}>
      <div className="modal-content card">
        <div className="modal-header bg-primary">
          <h5 className="modal-title mt-0 font-16 text-white"> Exclude Filters</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
          >
            <i className="ti-close text-white font-16" />
          </button>
        </div>
        <div className="modal-body">
          <div className="row p-4 align-items-baseline">
            <div
              className="col-sm-9 cloneLocationFilter mb-2"
              id="cloneLocationFilter1"
            >
              <select
                className="form-control dropdown-menu-border-4 b-b-1 rounded-0 dropdown-color e_selectpicker"
                name="param"
              >
                <option value={0}>Career Level</option>
                <option value={0}>Title</option>
                <option value={0}>Location</option>
              </select>
            </div>
            <div className="col-sm-3">
              <p className="text-uppercase font-weight-700 cursor pb-4 d-block text-primary addLocationFilter">
                <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                Add
              </p>
            </div>
            <div
              className="col-sm-9 cloneCompanyFilter mb-2"
              id="cloneCompanyFilter1"
            >
              <select
                className="form-control dropdown-menu-border-4 b-b-1 rounded-0 dropdown-color e_selectpicker"
                name="param"
              >
                <option value={0}>Experience</option>
                <option value="5years">5 Years</option>
                <option value="2years">2 Years</option>
              </select>
            </div>
            <div className="col-sm-3">
              <p className="text-uppercase font-weight-700 cursor pb-4 d-block text-primary addCompanyFilter">
                <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                Add
              </p>
            </div>
            <div className="col-sm-9">
              <div className="card mb-2 mt-3">
                <div className="p-2 d-flex align-items-center">
                  <i className="ejobs-icon-40-02" />
                  <input
                    type="text"
                    name="search_location"
                    id="search_major"
                    defaultValue
                    className="form-control font-14 b-b-1"
                    placeholder="Enter Location"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div
              className="col-sm-9 mb-2 cloneSchoolFilter "
              id="cloneSchoolFilter1"
            >
              <div className="card mb-2 mt-3">
                <div className="p-2 d-flex align-items-center">
                  <i className="ejobs-icon-40-02" />
                  <input
                    type="text"
                    name="search_location"
                    id="search_major"
                    defaultValue
                    className="form-control font-14 b-b-1"
                    placeholder="Enter Location"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="d-flex align-items-end-2 text-nowrap">
                <p className="text-uppercase font-weight-700 cursor addSchoolFilter mr-1 pb-4 d-block text-primary">
                  <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                  Add
                </p>
                <i className="ejobs-icon-28-01 cursor sa-warning " />
              </div>
            </div>
            <div
              className="col-sm-9 mb-2 cloneIndustryFilter"
              id="cloneIndustryFilter1"
            >
              <div className="card mb-2 mt-3">
                <div className="p-2 d-flex align-items-center">
                  <i className="ejobs-icon-8-02" />
                  <input
                    type="text"
                    name="search_jobtitle"
                    id="search_jobtitle"
                    defaultValue
                    className="form-control font-14 b-b-1"
                    placeholder="Job Title"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <p className="text-uppercase font-weight-700 cursor pb-4 d-block text-primary addIndustryFilter">
                <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                Add
              </p>
            </div>
            <div
              className="col-sm-9 mb-2 cloneHasEmailFilter"
              id="cloneHasEmailFilter1"
            >
              <div className="card mb-2 mt-3">
                <div className="p-2 d-flex align-items-center">
                  <i className="ejobs-icon-86-02" />
                  <input
                    type="text"
                    name="search_major"
                    id="search_major"
                    defaultValue
                    className="form-control font-14 b-b-1"
                    placeholder="Major"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <p className="text-uppercase font-weight-700 cursor addHasEmailFilter pb-4 d-block text-primary">
                <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                Add
              </p>
            </div>
            <div
              className="col-sm-9 mb-2 cloneIndusrtySearch"
              id="cloneIndusrtySearch1"
            >
              <div className="card mt-3">
                <div className="p-2 d-flex align-items-center">
                  <i className="ejobs-icon-2-02" />
                  <input
                    type="text"
                    name="search_major"
                    id="search_major"
                    defaultValue
                    className="form-control font-14 b-b-1"
                    placeholder="Industry"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <p className="text-uppercase font-weight-700 cursor addIndusrtySearch pb-4 d-block text-primary">
                <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                Add
              </p>
            </div>
            <div className="col-xl-10">
              <div
                className="input-group  bg-transparent cursor border-0 mb-3"
                onClick="advanceFilters();"
              >
                <div className="input-group-prepend w-100">
                  <div className="input-group-text bg-transparent   border-0 p-0 font-13 pr-1">
                    Advanced Search
                  </div>
                  <i className="ion-ios7-arrow-down w-100 text-right" />
                </div>
              </div>
              <div className="advance_filters_div" style={{ display: 'none' }}>
                <div className="row">
                  <div
                    className="col-sm-9 mb-2 cloneadvancedSearch"
                    id="cloneadvancedSearch1"
                  >
                    <select
                      name="search_nationality"
                      id="search_nationality"
                      className="dropdown-menu-border-4 b-b-1 rounded-0  e_selectpicker "
                      placeholder="Nationality"
                    >
                      <option value>Nationality</option>
                      <option value={5208}>Afghan</option>
                      <option value={5209}>Albanian</option>
                      <option value={5210}>Algerian</option>
                      <option value={5211}>American</option>
                    </select>
                  </div>
                  <div className="col-sm-3 ">
                    <p className="text-uppercase addAdvancedSearch font-weight-700 cursor pb-4 d-block text-primary">
                      <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                      Add
                    </p>
                  </div>
                  <div
                    className="col-sm-9 mb-2 acloneadvancedSearch"
                    id="acloneadvancedSearch1"
                  >
                    <select
                      name="search_gender"
                      id="search_gender"
                      className="dropdown-menu-border-4 dropdown-color b-b-1 rounded-0 e_selectpicker"
                      placeholder="Gender"
                    >
                      <option value>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <p className="text-uppercase aaddAdvancedSearch font-weight-700 cursor pb-4 d-block text-primary">
                      <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                      Add
                    </p>
                  </div>
                  <div
                    className="col-sm-9 mb-2 bcloneadvancedSearch"
                    id="bcloneadvancedSearch1"
                  >
                    <select
                      name="search_willing_travel"
                      id="search_willing_travel"
                      className=" dropdown-menu-border-4 b-b-1 rounded-0 dropdown-color e_selectpicker"
                      placeholder
                    >
                      <option value>Willing to Travel</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <p className="text-uppercase  baddAdvancedSearch font-weight-700 cursor pb-4 d-block text-primary">
                      <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                      Add
                    </p>
                  </div>
                  <div
                    className="col-sm-9 mb-2 ccloneadvancedSearch"
                    id="ccloneadvancedSearch1"
                  >
                    <select
                      name="search_willing_relocate"
                      id="search_willing_relocate"
                      className=" dropdown-menu-border-4 b-b-1 rounded-0 dropdown-color e_selectpicker"
                      placeholder
                    >
                      <option value>Willing to Relocate</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <p className="text-uppercase caddAdvancedSearch font-weight-700 cursor pb-4 d-block text-primary">
                      <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                      Add
                    </p>
                  </div>
                  <div
                    className="col-sm-9 mb-2 dcloneadvancedSearch"
                    id="dcloneadvancedSearch1"
                  >
                    <select
                      name="search_owns_car"
                      id="search_owns_car"
                      className="topopen dropdown-menu-border-4 b-b-1 rounded-0 dropdown-color e_selectpicker"
                      placeholder
                    >
                      <option value>Owns a car</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <p className="text-uppercase daddAdvancedSearch font-weight-700 cursor pb-4 d-block text-primary">
                      <i className="align-bottom mr-2 ion-ios7-plus-empty font-20  font-weight-600" />
                      Add
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 text-left pt-3">
              <button
                type="button"
                className="btn-primary pl-5 pr-5 border-0   btn"
                onClick={props.onClick}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
