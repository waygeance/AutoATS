import {
  validateOnlyAllowedChanges,
  replaceSection,
} from "../server/lib/latex";

test("validate allows only marked sections to change", () => {
  const orig = `A\n% START SUMMARY\nold summary\n% END SUMMARY\nB\n% START PROJECTS\nold projects\n% END PROJECTS\nC`;
  const updated = `A\n% START SUMMARY\nnew summary\n% END SUMMARY\nB\n% START PROJECTS\nold projects\n% END PROJECTS\nC`;
  expect(validateOnlyAllowedChanges(orig, updated)).toBe(true);
});

test("validate fails if other content changed", () => {
  const orig = `A\n% START SUMMARY\nold summary\n% END SUMMARY\nB`;
  const updated = `A_modified\n% START SUMMARY\nnew summary\n% END SUMMARY\nB`;
  expect(validateOnlyAllowedChanges(orig, updated)).toBe(false);
});
