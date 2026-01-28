import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolTable } from './tool-table';

describe('ToolTable', () => {
  let component: ToolTable;
  let fixture: ComponentFixture<ToolTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
