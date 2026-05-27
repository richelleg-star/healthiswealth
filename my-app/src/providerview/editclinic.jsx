import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, update, push, remove } from "firebase/database";
import { ProviderBar } from "../navbar/providerbar";
import { SubBar } from "../navbar/subbar";
import { TagInput } from "../components/maketags";
import { auth } from "../../firebase";

export function EditClinic() {
    const [clinics, setClinics] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [view, setView] = useState("edit");
    const [editingClinic, setEditingClinic] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editingBranch, setEditingBranch] = useState(null);
    const [branchForm, setBranchForm] = useState({});

    // new clinic form state
    const [newClinic, setNewClinic] = useState({
        Name: '',
        Address: '',
        hours: '',
        freeOrLowCost: 'Low Cost',
        needapt: true,
        link: '',
        Tags: [],
        AltInsurance: [],
    });

    const db = getDatabase();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/providerlogin');
            }
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchClinics = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const clinicsRef = ref(db, "clinicalternatives");
            const snapshot = await get(clinicsRef);

            if (snapshot.exists()) {
                const userClinics = [];
                snapshot.forEach((child) => {
                    const data = child.val();
                    if (data.uid !== user.uid) return; // only show this provider's clinics

                    const rawTags = data.Tags;
                    const branches = data.branches
                        ? Object.entries(data.branches).map(([key, val]) => ({ id: key, ...val }))
                        : [];

                    userClinics.push({
                        id: child.key,
                        ...data,
                        Tags: Array.isArray(rawTags) ? rawTags : rawTags ? Object.values(rawTags) : [],
                        branches,
                    });
                });
                setClinics(userClinics);
            }
        };

        fetchClinics();
    }, [currentUser]);

    const normalizeTags = (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        return Object.values(tags);
    };

    // ── Add new clinic location ──────────────────────────────
    const handleAddClinic = async (e) => {
        e.preventDefault();
        if (!newClinic.Name || !newClinic.Address) {
            alert('Clinic name and address are required.');
            return;
        }
        try {
            // Use clinic name as key (strip spaces) to match your existing structure
            const clinicKey = newClinic.Name.replace(/\s+/g, '');
            const clinicRef = ref(db, `clinicalternatives/${clinicKey}`);
            await update(clinicRef, {
                Name: newClinic.Name,
                Address: newClinic.Address,
                hours: newClinic.hours,
                freeOrLowCost: newClinic.freeOrLowCost,
                needapt: newClinic.needapt,
                link: newClinic.link,
                Tags: newClinic.Tags,
                AltInsurance: newClinic.AltInsurance,
                uid: auth.currentUser.uid,
            });
            alert('Clinic added!');
            setNewClinic({ Name: '', Address: '', hours: '', freeOrLowCost: 'Low Cost', needapt: true, link: '', Tags: [], AltInsurance: '' });
            // refresh
            const snapshot = await get(ref(db, "clinicalternatives"));
            if (snapshot.exists()) {
                const userClinics = [];
                snapshot.forEach((child) => {
                    const data = child.val();
                    if (data.uid !== auth.currentUser.uid) return;
                    const rawTags = data.Tags;
                    const branches = data.branches
                        ? Object.entries(data.branches).map(([key, val]) => ({ id: key, ...val }))
                        : [];
                    userClinics.push({
                        id: child.key,
                        ...data,
                        Tags: Array.isArray(rawTags) ? rawTags : rawTags ? Object.values(rawTags) : [],
                        branches,
                    });
                });
                setClinics(userClinics);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // ── Edit main clinic info ────────────────────────────────
    const handleEditClick = (clinic) => {
        setEditingClinic(clinic.id);
        setEditingBranch(null);
        setEditForm({
            Name: clinic.Name || '',
            Address: clinic.Address || '',
            hours: clinic.hours || '',
            freeOrLowCost: clinic.freeOrLowCost || 'Low Cost',
            needapt: clinic.needapt ?? true,
            link: clinic.link || '',
            Tags: normalizeTags(clinic.Tags),
            AltInsurance: clinic.AltInsurance || '',
        });
    };

    const handleEditSave = async (clinicId) => {
        try {
            await update(ref(db, `clinicalternatives/${clinicId}`), {
                ...editForm,
                Tags: editForm.Tags,
            });
            setClinics(prev => prev.map(c =>
                c.id === clinicId ? { ...c, ...editForm } : c
            ));
            setEditingClinic(null);
            alert('Clinic updated!');
        } catch (error) {
            alert(error.message);
        }
    };

    // ── Add a branch to an existing clinic ──────────────────
    const handleAddBranch = async (clinicId) => {
        if (!branchForm.Name || !branchForm.Address) {
            alert('Branch name and address are required.');
            return;
        }
        try {
            const branchRef = ref(db, `clinicalternatives/${clinicId}/branches`);
            const newBranchRef = push(branchRef);
            await update(newBranchRef, {
                Name: branchForm.Name,
                Address: branchForm.Address,
                hours: branchForm.hours || '',
            });
            setClinics(prev => prev.map(c =>
                c.id === clinicId
                    ? { ...c, branches: [...c.branches, { id: newBranchRef.key, ...branchForm }] }
                    : c
            ));
            setBranchForm({});
            setEditingBranch(null);
            alert('Branch added!');
        } catch (error) {
            alert(error.message);
        }
    };

    // ── Remove a branch ──────────────────────────────────────
    const handleRemoveBranch = async (clinicId, branchId, branchName) => {
        if (!window.confirm(`Remove branch "${branchName}"?`)) return;
        try {
            await remove(ref(db, `clinicalternatives/${clinicId}/branches/${branchId}`));
            setClinics(prev => prev.map(c =>
                c.id === clinicId
                    ? { ...c, branches: c.branches.filter(b => b.id !== branchId) }
                    : c
            ));
        } catch (error) {
            alert(error.message);
        }
    };

    if (!authChecked) return null;

    const inputStyle = { width: '100%', marginBottom: '0.5rem' };

    return (
        <>
            <ProviderBar />
            <SubBar
                view={view}
                onViewChange={setView}
                tabs={[
                    { label: "Add Clinic", value: "add" },
                    { label: "Edit Clinic", value: "edit" },
                ]}
            />

            <div className="provider-panel" style={{ maxWidth: '700px', margin: '2rem auto' }}>

                {/* ADD VIEW */}
                {view === "add" && (
                    <>
                        <h2>Add a Clinic Location</h2>
                        <p>Add a new clinic or branch location for patients to find.</p>
                        <form onSubmit={handleAddClinic}>
                            <label>Clinic Name</label>
                            <input style={inputStyle} type="text" placeholder="Kaiser Permanente Capitol Hill"
                                value={newClinic.Name} onChange={e => setNewClinic(f => ({ ...f, Name: e.target.value }))} />
                            <label>Address</label>
                            <input style={inputStyle} type="text" placeholder="123 Main St, Seattle, WA"
                                value={newClinic.Address} onChange={e => setNewClinic(f => ({ ...f, Address: e.target.value }))} />
                            <label>Hours</label>
                            <input style={inputStyle} type="text" placeholder="Mon-Fri, 9AM - 5PM"
                                value={newClinic.hours} onChange={e => setNewClinic(f => ({ ...f, hours: e.target.value }))} />
                            <label>Cost</label>
                            <select style={inputStyle} value={newClinic.freeOrLowCost}
                                onChange={e => setNewClinic(f => ({ ...f, freeOrLowCost: e.target.value }))}>
                                <option>Free</option>
                                <option>Low Cost</option>
                            </select>
                            <label>Need Appointment</label>
                            <select style={inputStyle} value={newClinic.needapt}
                                onChange={e => setNewClinic(f => ({ ...f, needapt: e.target.value }))}>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                            </select>
                            <label>Link</label>
                            <input style={inputStyle} type="text"
                                value={newClinic.link} onChange={e => setNewClinic(f => ({ ...f, link: e.target.value }))} />
                            <label>Alternative Insurance Info</label>
                            <input style={inputStyle} type="text"
                                value={newClinic.AltInsurance} onChange={e => setNewClinic(f => ({ ...f, AltInsurance: e.target.value }))} />
                            <label>Tags</label>
                            <TagInput
                                value={newClinic.Tags}
                                onChange={val => setNewClinic(f => ({ ...f, Tags: val }))}
                                placeholder="e.g. Free, Mental Health, Dental"
                            />
                            <button className="btn-save" type="submit" style={{ marginTop: '1rem' }}>Add Clinic</button>
                        </form>
                    </>
                )}

                {/* EDIT VIEW */}
                {view === "edit" && (
                    <>
                        <h2>Edit Your Clinics</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Edit clinic details or manage branch locations.
                        </p>
                        {clinics.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>You haven't added any clinics yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {clinics.map((clinic) => (
                                    <div key={clinic.id} style={{
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        background: 'var(--bg-color)',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Clinic header row */}
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', padding: '1rem',
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                                    {clinic.Name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {clinic.Address} · {clinic.hours}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => editingClinic === clinic.id ? setEditingClinic(null) : handleEditClick(clinic)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--text-muted)',
                                                    borderRadius: '6px',
                                                    padding: '0.4rem 0.9rem',
                                                    fontFamily: 'inherit',
                                                    fontWeight: '600',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {editingClinic === clinic.id ? 'Cancel' : 'Edit'}
                                            </button>
                                        </div>

                                        {/* Inline edit form */}
                                        {editingClinic === clinic.id && (
                                            <div style={{
                                                borderTop: '1px solid var(--border)',
                                                padding: '1rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                            }}>
                                                <label>Clinic Name</label>
                                                <input type="text" value={editForm.Name}
                                                    onChange={e => setEditForm(f => ({ ...f, Name: e.target.value }))} />
                                                <label>Address</label>
                                                <input type="text" value={editForm.Address}
                                                    onChange={e => setEditForm(f => ({ ...f, Address: e.target.value }))} />
                                                <label>Hours</label>
                                                <input type="text" value={editForm.hours}
                                                    onChange={e => setEditForm(f => ({ ...f, hours: e.target.value }))} />
                                                <label>Cost</label>
                                                <select value={editForm.freeOrLowCost}
                                                    onChange={e => setEditForm(f => ({ ...f, freeOrLowCost: e.target.value }))}>
                                                    <option>Free</option>
                                                    <option>Low Cost</option>
                                                </select>
                                                <label>Need Appointment</label>
                                                <select value={editForm.needapt}
                                                    onChange={e => setEditForm(f => ({ ...f, needapt: e.target.value }))}>
                                                    <option value={true}>True</option>
                                                    <option value={false}>False</option>
                                                </select>
                                                <label>Link</label>
                                                <input type="text" value={editForm.link}
                                                    onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))} />
                                                <label>Alternative Insurance Info</label>
                                                <input type="text" value={editForm.AltInsurance}
                                                    onChange={e => setEditForm(f => ({ ...f, AltInsurance: e.target.value }))} />
                                                <label>Tags</label>
                                                <TagInput
                                                    value={editForm.Tags}
                                                    onChange={val => setEditForm(f => ({ ...f, Tags: val }))}
                                                />
                                                <button className="btn-save" onClick={() => handleEditSave(clinic.id)}>
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}

                                        {/* Branches section */}
                                        <div style={{
                                            borderTop: '1px solid var(--border)',
                                            padding: '1rem',
                                            background: 'var(--bg-secondary, var(--bg-color))',
                                        }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                                LOCATIONS / BRANCHES
                                            </div>

                                            {/* Existing branches */}
                                            {clinic.branches.length === 0 && (
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No additional branches.</p>
                                            )}
                                            {clinic.branches.map((branch) => (
                                                <div key={branch.id} style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    alignItems: 'center', padding: '0.5rem 0',
                                                    borderBottom: '1px solid var(--border)',
                                                }}>
                                                    <div>
                                                        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{branch.Name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{branch.Address} · {branch.hours}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveBranch(clinic.id, branch.id, branch.Name)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid #ef4444',
                                                            color: '#ef4444',
                                                            borderRadius: '6px',
                                                            padding: '0.3rem 0.7rem',
                                                            fontFamily: 'inherit',
                                                            fontWeight: '600',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                        }}
                                                        onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
                                                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add branch form */}
                                            {editingBranch === clinic.id ? (
                                                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    <input type="text" placeholder="Branch Name (e.g. Kaiser Capitol Hill)"
                                                        value={branchForm.Name || ''}
                                                        onChange={e => setBranchForm(f => ({ ...f, Name: e.target.value }))} />
                                                    <input type="text" placeholder="Address"
                                                        value={branchForm.Address || ''}
                                                        onChange={e => setBranchForm(f => ({ ...f, Address: e.target.value }))} />
                                                    <input type="text" placeholder="Hours"
                                                        value={branchForm.hours || ''}
                                                        onChange={e => setBranchForm(f => ({ ...f, hours: e.target.value }))} />
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="btn-save" onClick={() => handleAddBranch(clinic.id)}>
                                                            Save Branch
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingBranch(null); setBranchForm({}); }}
                                                            style={{
                                                                background: 'transparent',
                                                                border: '1px solid var(--border)',
                                                                color: 'var(--text-muted)',
                                                                borderRadius: '6px',
                                                                padding: '0.4rem 0.9rem',
                                                                fontFamily: 'inherit',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingBranch(clinic.id)}
                                                    style={{
                                                        marginTop: '0.75rem',
                                                        background: 'transparent',
                                                        border: '1px solid var(--border)',
                                                        color: 'var(--text-muted)',
                                                        borderRadius: '6px',
                                                        padding: '0.4rem 0.9rem',
                                                        fontFamily: 'inherit',
                                                        fontWeight: '500',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    + Add Branch
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}