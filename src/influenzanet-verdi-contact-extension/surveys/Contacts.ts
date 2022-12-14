import { DateDisplayComponentProp, Item, StyledTextComponentProp, SurveyDefinition } from "case-editor-tools/surveys/types";
import { SurveyEngine, SurveyItems } from "case-editor-tools/surveys";
import { StudyEngine } from "case-editor-tools/expression-utils/studyEngineExpressions";
import { surveyKeys } from "../constants";
import { Expression } from "survey-engine/data_types";
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';


class ContactsDef extends SurveyDefinition {
  Infos: Infos;
  Q1: Q1;
  Q2: Q2;
  ContactMatrixForHome: ContaxtMatricWithoutGender;
  ProtectionUsageForHome: ProtectionUsage;

  ContactMatrixForWork: ContaxtMatricWithoutGender;
  ProtectionUsageForWork: ProtectionUsage;

  ContactMatrixForLeisure: ProtectionUsage;
  ProtectionUsageForLeisure: ProtectionUsage;
  QFragile: QFragile;

  constructor() {
    super({
      surveyKey: surveyKeys.Contacts,
      name: new Map([
        ["en", "Contacts survey"],
      ]),
      description: new Map([
        ["en", "Survey about contacts."],
      ]),
      durationText: new Map([
        ["en", "1 minute"],
      ])
    });

    this.editor.setAvailableFor('public');
    this.editor.setRequireLoginBeforeSubmission(false);

    const isRequired = true;

    // Initialize/Configure questions here:
    this.Infos = new Infos(this.key);

    this.Q1 = new Q1(this.key, isRequired);
    this.Q2 = new Q2(this.key, SurveyEngine.singleChoice.any(this.Q1.key, this.Q1.optionKeys.yes), isRequired);

    const conditionForHome = SurveyEngine.multipleChoice.any(this.Q2.key, this.Q2.optionKeys.home);
    this.ContactMatrixForHome = new ContaxtMatricWithoutGender(
      this.key,
      'ContactsHome',
      new Map([['en', 'Indicate the number of contacts at home (per age category and indoor/outdoor)']]),
      conditionForHome,
      isRequired
    );
    this.ProtectionUsageForHome = new ProtectionUsage(
      this.key,
      'ProtectionHome',
      new Map([['en', 'Did you use a sort of protection at home at any time (e.g. face mask or face shield)?']]),
      conditionForHome,
      isRequired
    );

    /// WORK
    const conditionForWork = SurveyEngine.multipleChoice.any(this.Q2.key, this.Q2.optionKeys.work, this.Q2.optionKeys.school);
    this.ContactMatrixForWork = new ContaxtMatricWithoutGender(
      this.key,
      'ContactsWork',
      new Map([['en', 'Indicate the number of contacts at work (per age category and indoor/outdoor)']]),
      conditionForWork,
      isRequired
    );
    this.ProtectionUsageForWork = new ProtectionUsage(
      this.key,
      'ProtectionWork',
      new Map([['en', 'Did you use a sort of protection during these work or school activites at any time (e.g. face mask or face shield)?']]),
      conditionForWork,
      isRequired
    );

    /// LEISURE
    const conditionForLeisure = SurveyEngine.multipleChoice.any(this.Q2.key, this.Q2.optionKeys.leisure, this.Q2.optionKeys.other);
    this.ContactMatrixForLeisure = new ContaxtMatricWithoutGender(
      this.key,
      'ContactsOther',
      new Map([['en', 'Indicate the number of contacts during leisure and other (per age category and indoor/outdoor)']]),
      conditionForLeisure,
      isRequired
    );
    this.ProtectionUsageForLeisure = new ProtectionUsage(
      this.key,
      'ProtectionLeisure',
      new Map([['en', 'Did you use a sort of protection during these leisure and other activites at any time (e.g. face mask or face shield)?']]),
      conditionForLeisure,
      isRequired
    );

    this.QFragile = new QFragile(this.key, isRequired)


    /// Prefill rules:

    this.editor.setPrefillRules([
      /// HOME:
      // for indoor:
      ...['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'].map(key =>
        StudyEngine.prefillRules.PREFILL_SLOT_WITH_VALUE(this.ContactMatrixForHome.key, `rg.rm.${key}-i`, '0')
      ),
      // for outdoor:
      ...['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'].map(key =>
        StudyEngine.prefillRules.PREFILL_SLOT_WITH_VALUE(this.ContactMatrixForHome.key, `rg.rm.${key}-o`, '0')
      ),
      /// WORK:
      // for indoor:
      ...['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'].map(key =>
        StudyEngine.prefillRules.PREFILL_SLOT_WITH_VALUE(this.ContactMatrixForWork.key, `rg.rm.${key}-i`, '0')
      ),
      // for outdoor:
      ...['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'].map(key =>
        StudyEngine.prefillRules.PREFILL_SLOT_WITH_VALUE(this.ContactMatrixForWork.key, `rg.rm.${key}-o`, '0')
      ),
      /// OTHER:
      // for indoor:
      ...['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'].map(key =>
        StudyEngine.prefillRules.PREFILL_SLOT_WITH_VALUE(this.ContactMatrixForLeisure.key, `rg.rm.${key}-i`, '0')
      ),
      // for outdoor:
      ...['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'].map(key =>
        StudyEngine.prefillRules.PREFILL_SLOT_WITH_VALUE(this.ContactMatrixForLeisure.key, `rg.rm.${key}-o`, '0')
      ),

    ]);
  }

  buildSurvey() {
    // Define order of the questions here:
    this.addItem(this.Infos.get());
    this.addItem(this.Q1.get());
    this.addItem(this.Q2.get());
    this.addPageBreak();
    this.addItem(this.ContactMatrixForHome.get());
    this.addItem(this.ProtectionUsageForHome.get());
    this.addPageBreak();
    this.addItem(this.ContactMatrixForWork.get());
    this.addItem(this.ProtectionUsageForWork.get());
    this.addPageBreak();
    this.addItem(this.ContactMatrixForLeisure.get());
    this.addItem(this.ProtectionUsageForLeisure.get());
    this.addPageBreak();
    this.addItem(this.QFragile.get());
  }
}


class Infos extends Item {
  constructor(parentKey: string, condition?: Expression) {
    super(parentKey, 'Info');

    this.condition = condition;
  }

  buildItem() {
    return SurveyItems.display({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      condition: this.condition,
      content: [
        ComponentGenerators.markdown({
          content: new Map([
            ["en", `
### Introduction

The onward transmission of respiratory infections depend on with whom you talked, could have talked or whom you touched (presence less than three meter; contact by phone or internet doesn't count; physical contact = kiss, hug, shaking hand etc.)

Because a lot of transmission happen when the symptoms are very mild, the contact you have every day (thus also when you are healthy) are very informative in predicting whom you might infect when you have an infection.

Therefore, we study how people contact others.

Could you answer some questions about whom you contacted between 5 am yesterday morning and 5 am this morning?

In this we are not interested in your private life: we don't need to know if your contacts were conversational or physical, and we don't need to know the gender of the contacts.

However, we do ask about the (possible) age-range of your contacts, the setting (household, work, school etc.) and whether they were indoor or outdoor.

In the questions we speak about two things which can be unclear:

**Household**: all people you live with on a daily basis, and sleep under the same roof (for example also co-residents).

**Indoor/outdoor**:  Indoor refers to areas in a building or other structure, whether or not temporary, which has a roof, ceiling or other top covering and has 3 or more sides protecting it from the weather. Thus, it does not include an area with at least 2 sides open to the weather.

If a contact has significant both indoor and outdoor parts, it should be considered as "indoor".

To help the analysis we also categorised contacts. The possible categories/ locations and non-exhaustive list of example contacts is:
- Home: your house (example of contact: people visiting **your** house,...).
- Work: your working location (example of contact: customer, co-workers, ???.). If you have multiple jobs, please include them all.
- School: your school or university or higher education location (example of contacts: teacher, ???)
- Social activity: Every activity you planned to do with other people (example of contacts: person met at a bar or at the gym or in a house **different from yours**).
- Other: everything not listed before (example of contacts: person met during commuting,...).

`
            ],
          ]),
          className: ''
        })
      ]
    })
  }
}

class ContactMatrixWithGender extends Item {
  constructor(parentKey: string, itemKey: string, isRequired?: boolean) {
    super(parentKey, itemKey);
    this.isRequired = isRequired;
  }

  generateRows() {
    const rowCategories = [
      {
        key: 'r1', role: 'category', label: new Map([
          ["en", "0 - 3"],
        ]),
      },
      {
        key: 'r2', role: 'category', label: new Map([
          ["en", "3 - 6"],
        ]),
      },
      {
        key: 'r3', role: 'category', label: new Map([
          ["en", "7 - 12"],
        ]),
      },
      {
        key: 'r4', role: 'category', label: new Map([
          ["en", "13 - 18"],
        ]),
      },
      {
        key: 'r5', role: 'category', label: new Map([
          ["en", "19 - 29"],
        ]),
      },
      {
        key: 'r6', role: 'category', label: new Map([
          ["en", "30 - 39"],
        ]),
      },
      {
        key: 'r7', role: 'category', label: new Map([
          ["en", "40 - 49"],
        ]),
      },
      {
        key: 'r8', role: 'category', label: new Map([
          ["en", "50 - 59"],
        ]),
      },
      {
        key: 'r9', role: 'category', label: new Map([
          ["en", "60 - 69"],
        ]),
      },
      {
        key: 'r10', role: 'category', label: new Map([
          ["en", "70 - 79"],
        ]),
      },
      {
        key: 'r11', role: 'category', label: new Map([
          ["en", "80 - 89"],
        ]),
      },
      {
        key: 'r12', role: 'category', label: new Map([
          ["en", "90+"],
        ]),
      },
    ];

    const rows: any[] = [];
    rowCategories.forEach(row => {
      rows.push(row);
      rows.push({
        key: `${row.key}m`, role: 'row', label: new Map([
          ["en", "Male"],
        ]),
      });
      rows.push({
        key: `${row.key}f`, role: 'row', label: new Map([
          ["en", "Female"],
        ]),
      });
    })

    return rows;
  }

  buildItem() {
    return SurveyItems.responsiveMatrix({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      isRequired: this.isRequired,
      condition: this.condition,
      questionText: new Map([
        ["en", "TODO: question text"],
      ]),
      questionSubText: new Map([
        ["en", "TODO: explanation"],
      ]),
      responseType: 'dropdown',
      breakpoint: 'sm',
      columns: [
        {
          key: 'i', label: new Map([
            ["en", "Indoor"],
          ]),
        },
        {
          key: 'o', label: new Map([
            ["en", "Outdoor"],
          ]),
        }
      ],
      rows: this.generateRows(),
      dropdownConfig: {
        unselectedLabeL: new Map([
          ["en", "Select an option"],
        ]),
        options: [
          { key: '0', label: new Map([["en", "0"],]), },
          { key: '1', label: new Map([["en", "1"],]), },
          { key: '2', label: new Map([["en", "2"],]), },
          { key: '3', label: new Map([["en", "3 - 4"],]), },
          { key: '4', label: new Map([["en", "5 - 9"],]), },
          { key: '5', label: new Map([["en", "9+"],]), },
        ]
      }
    })
  }
}


class ContaxtMatricWithoutGender extends Item {
  qText: Map<string, string> | (StyledTextComponentProp | DateDisplayComponentProp)[];

  constructor(parentKey: string,
    itemKey: string,
    qText: Map<string, string> | (StyledTextComponentProp | DateDisplayComponentProp)[],
    condition: Expression,
    isRequired?: boolean) {
    super(parentKey, itemKey);
    this.isRequired = isRequired;
    this.condition = condition;
    this.qText = qText;
  }

  generateRows() {
    const rowCategories = [
      {
        key: 'r1', role: 'row', label: new Map([
          ["en", "0 - 3"],
        ]),
      },
      {
        key: 'r2', role: 'row', label: new Map([
          ["en", "3 - 6"],
        ]),
      },
      {
        key: 'r3', role: 'row', label: new Map([
          ["en", "7 - 12"],
        ]),
      },
      {
        key: 'r4', role: 'row', label: new Map([
          ["en", "13 - 18"],
        ]),
      },
      {
        key: 'r5', role: 'row', label: new Map([
          ["en", "19 - 29"],
        ]),
      },
      {
        key: 'r6', role: 'row', label: new Map([
          ["en", "30 - 39"],
        ]),
      },
      {
        key: 'r7', role: 'row', label: new Map([
          ["en", "40 - 49"],
        ]),
      },
      {
        key: 'r8', role: 'row', label: new Map([
          ["en", "50 - 59"],
        ]),
      },
      {
        key: 'r9', role: 'row', label: new Map([
          ["en", "60 - 69"],
        ]),
      },
      {
        key: 'r10', role: 'row', label: new Map([
          ["en", "70 - 79"],
        ]),
      },
      {
        key: 'r11', role: 'row', label: new Map([
          ["en", "80 - 89"],
        ]),
      },
      {
        key: 'r12', role: 'row', label: new Map([
          ["en", "90+"],
        ]),
      },
    ];

    const rows: any[] = [];
    rowCategories.forEach(row => {
      rows.push(row);
    })

    return rows;
  }

  buildItem() {
    return SurveyItems.responsiveMatrix({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      isRequired: this.isRequired,
      condition: this.condition,
      questionText: this.qText,
      responseType: 'dropdown',
      breakpoint: 'sm',
      columns: [
        {
          key: 'i', label: new Map([
            ["en", "Indoor"],
          ]),
        },
        {
          key: 'o', label: new Map([
            ["en", "Outdoor"],
          ]),
        }
      ],
      rows: this.generateRows(),
      dropdownConfig: {
        unselectedLabeL: new Map([
          ["en", "Select an option"],
        ]),
        options: [
          { key: '0', label: new Map([["en", "0"],]), },
          { key: '1', label: new Map([["en", "1"],]), },
          { key: '2', label: new Map([["en", "2"],]), },
          { key: '3', label: new Map([["en", "3 - 4"],]), },
          { key: '4', label: new Map([["en", "5 - 9"],]), },
          { key: '5', label: new Map([["en", "9+"],]), },
        ]
      }
    })
  }
}


class ProtectionUsage extends Item {
  qText: Map<string, string> | (StyledTextComponentProp | DateDisplayComponentProp)[];

  constructor(parentKey: string,
    itemKey: string,
    qText: Map<string, string> | (StyledTextComponentProp | DateDisplayComponentProp)[],
    condition: Expression,
    isRequired?: boolean) {
    super(parentKey, itemKey);
    this.isRequired = isRequired;
    this.condition = condition;
    this.qText = qText;
  }

  buildItem() {
    return SurveyItems.singleChoice({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      isRequired: this.isRequired,
      condition: this.condition,
      questionText: this.qText,
      responseOptions: [
        {
          key: '0', role: 'option',
          content: new Map([
            ["en", "No"],
          ])
        },
        {
          key: '1', role: 'option',
          content: new Map([
            ["en", "Yes"],
          ])
        },
        {
          key: '2', role: 'option',
          content: new Map([
            ["en", "I don't remember"],
          ])
        },
      ]
    })
  }
}


class Q1 extends Item {
  optionKeys = {
    yes: '1',
    no: '0',
    other: '3',
  };

  constructor(parentKey: string, isRequired?: boolean) {
    super(parentKey, 'Q1');
    this.isRequired = isRequired;
  }

  buildItem() {
    return SurveyItems.singleChoice({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      isRequired: this.isRequired,
      condition: this.condition,
      questionText: new Map([
        ["en", "Did you had any contacts yesterday?"],
      ]),
      questionSubText: new Map([
        ["en", "Household member not included"],
      ]),
      responseOptions: [
        {
          key: this.optionKeys.yes, role: 'option',
          content: new Map([
            ["en", "Yes"],
          ])
        },
        {
          key: this.optionKeys.no, role: 'option',
          content: new Map([
            ["en", "No"],
          ])
        },
        {
          key: this.optionKeys.other, role: 'option',
          content: new Map([
            ["en", "I don't want to say"],
          ])
        }
      ]
    })
  }
}

class Q2 extends Item {
  optionKeys = {
    home: '1',
    work: '2',
    school: '3',
    leisure: '4',
    other: '5',
  };

  constructor(parentKey: string, condition: Expression, isRequired?: boolean) {
    super(parentKey, 'Q2');
    this.isRequired = isRequired;
    this.condition = condition;
  }

  buildItem() {
    return SurveyItems.multipleChoice({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      isRequired: this.isRequired,
      condition: this.condition,
      questionText: new Map([
        ["en", "Select the location(s) in which you had these contacts"],
      ]),
      responseOptions: [
        {
          key: this.optionKeys.home, role: 'option',
          content: new Map([
            ["en", "Home"],
          ])
        },
        {
          key: this.optionKeys.work, role: 'option',
          content: new Map([
            ["en", "Work"],
          ])
        },
        {
          key: this.optionKeys.school, role: 'option',
          content: new Map([
            ["en", "School"],
          ])
        },
        {
          key: this.optionKeys.leisure, role: 'option',
          content: new Map([
            ["en", "Social activities"],
          ])
        },
        {
          key: this.optionKeys.other, role: 'option',
          content: new Map([
            ["en", "Other"],
          ])
        }
      ]
    })
  }
}


class QFragile extends Item {
  optionKeys = {
    no: '0',
  };

  constructor(parentKey: string, isRequired?: boolean) {
    super(parentKey, 'QFragile');
    this.isRequired = isRequired;
    // this.condition = condition;
  }

  buildItem() {
    return SurveyItems.multipleChoice({
      parentKey: this.parentKey,
      itemKey: this.itemKey,
      isRequired: this.isRequired,
      condition: this.condition,
      questionText: new Map([
        ["en", "Did you visit an institute with (many) fragile people between yesterday 5am and 5 am today?"],
      ]),
      responseOptions: [
        {
          key: this.optionKeys.no, role: 'option',
          content: new Map([
            ["en", "No"],
          ]),
          disabled: SurveyEngine.multipleChoice.any(this.key, '1', '2', 'other')
        },
        {
          key: '1', role: 'option',
          content: new Map([
            ["en", "Yes, a care home"],
          ]),
          disabled: SurveyEngine.multipleChoice.any(this.key, this.optionKeys.no)
        },
        {
          key: '2', role: 'option',
          content: new Map([
            ["en", "Yes, a hospital"],
          ]),
          disabled: SurveyEngine.multipleChoice.any(this.key, this.optionKeys.no)
        },
        {
          key: 'other', role: 'input',
          content: new Map([
            ["en", "Other: "],
          ]),
          disabled: SurveyEngine.multipleChoice.any(this.key, this.optionKeys.no)
        },
      ]
    })
  }
}



export const Contacts = new ContactsDef();
