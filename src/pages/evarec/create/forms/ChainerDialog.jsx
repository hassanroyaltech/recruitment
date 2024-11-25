import React from 'react';
import { Button } from 'reactstrap';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DEBUG } from 'utils/constants/env';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * YoshiGraph Chainer dialog [Description generator]
 * @returns {JSX.Element}
 * @constructor
 */
export function ChainerDialog() {
  const { t } = useTranslation(parentTranslationPath);
  const [open, setOpen] = React.useState(false);

  const [state, setState] = React.useState({
    role: '',
    checkboxSkills: true,
    checkboxCareerLevel: false,
    checkboxSkillsViaCareerLevel: false,
    checkboxIndustry: false,
    checkboxMajor: false,
    checkboxYearsOfExperience: false,
    partialSwitch: false,
    orientation: 1,
  });

  const handleChange = (event) => {
    setState((items) => ({ ...items, [event.target.name]: event.target.checked }));
  };
  const handleTextChange = (event, field) => {
    setState((items) => ({ ...items, [field]: event.target.value }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* <Button
        disabled={!DEBUG}
        className="btn btn-evarec text-white border-0"
        onClick={handleClickOpen}
      >
        {t(`${translationPath}description-generator`)}
      </Button> */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {t(`${translationPath}yoshi-graph-chainer`)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray">
            {t(`${translationPath}yoshi-graph-description`)}.
          </DialogContentText>
          <div>
            <FormControl component="fieldset" className="w-100">
              <FormGroup>
                <FormControlLabel
                  className="justify-content-center mt-2"
                  control={
                    <Switch
                      checked={state.partialSwitch}
                      onChange={handleChange}
                      name="partialSwitch"
                      color="primary"
                    />
                  }
                  label={
                    state.partialSwitch
                      ? t(`${translationPath}specific-fields`)
                      : t(`${translationPath}all-fields`)
                  }
                />
                {state.partialSwitch && (
                  <>
                    <div>
                      <hr className="" />
                    </div>
                    <p className="font-weight-400 text-gray">
                      {t(`${translationPath}select-the-associated-fields`)}.
                    </p>
                    <FormControlLabel
                      className="px-4"
                      control={
                        <Checkbox
                          color="primary"
                          checked={state.checkboxSkills}
                          onChange={handleChange}
                          name="checkboxSkills"
                        />
                      }
                      label={t(`${translationPath}skills`)}
                    />
                    <FormControlLabel
                      className="px-4"
                      control={
                        <Checkbox
                          color="primary"
                          checked={state.checkboxSkillsViaCareerLevel}
                          onChange={handleChange}
                          name="checkboxSkillsViaCareerLevel"
                        />
                      }
                      label={t(`${translationPath}skills-adjusted-by-seniority`)}
                    />
                    <FormControlLabel
                      className="px-4"
                      control={
                        <Checkbox
                          color="primary"
                          checked={state.checkboxCareerLevel}
                          onChange={handleChange}
                          name="checkboxCareerLevel"
                        />
                      }
                      label={t(`${translationPath}career-level`)}
                    />
                    <FormControlLabel
                      className="px-4"
                      control={
                        <Checkbox
                          color="primary"
                          checked={state.checkboxIndustry}
                          onChange={handleChange}
                          name="checkboxIndustry"
                        />
                      }
                      label={t(`${translationPath}industry`)}
                    />
                    <FormControlLabel
                      className="px-4"
                      control={
                        <Checkbox
                          color="primary"
                          checked={state.checkboxMajor}
                          onChange={handleChange}
                          name="checkboxMajor"
                        />
                      }
                      label={t(`${translationPath}major`)}
                    />
                    <FormControlLabel
                      className="px-4"
                      control={
                        <Checkbox
                          color="primary"
                          checked={state.checkboxYearsOfExperience}
                          onChange={handleChange}
                          name="checkboxYearsOfExperience"
                        />
                      }
                      label={t(`${translationPath}years-of-experience`)}
                    />
                  </>
                )}
                {!state.partialSwitch && (
                  <>
                    <br />
                    <p className="font-weight-400 text-gray">
                      {t(`${translationPath}partial-switch-description`)}.
                    </p>
                    <TextField
                      margin="dense"
                      id="name"
                      label={t(`${translationPath}role-position`)}
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={state.role}
                      onChange={(e) => handleTextChange(e, 'role')}
                    />
                  </>
                )}
              </FormGroup>
              {/* <FormHelperText>Be careful</FormHelperText> */}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center my-3">
          <Button onClick={handleClose} color="primary">
            {t(`${translationPath}generate`)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
