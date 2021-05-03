import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneComponent } from './stone.component';

describe('StoneComponent', () => {
  let component: StoneComponent;
  let fixture: ComponentFixture<StoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
